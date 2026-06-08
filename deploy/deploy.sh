#!/usr/bin/env sh
set -eu

ENV_FILE="${ENV_FILE:-/etc/website-deploy.env}"

if [ -r "$ENV_FILE" ]; then
  set -a
  . "$ENV_FILE"
  set +a
fi

REPO_DIR="${REPO_DIR:-/opt/website/app}"
REPO_USER="${REPO_USER:-codex}"
BRANCH="${DEPLOY_BRANCH:-${BRANCH:-master}}"
IMAGE_NAME="${IMAGE_NAME:-website-app}"
CONTAINER_NAME="${CONTAINER_NAME:-website-app}"
CANDIDATE_CONTAINER_NAME="${CANDIDATE_CONTAINER_NAME:-${CONTAINER_NAME}-candidate}"
APP_PORT="${APP_PORT:-3000}"
CANDIDATE_APP_PORT="${CANDIDATE_APP_PORT:-3001}"
CONTAINER_PORT="${CONTAINER_PORT:-3000}"
HEALTH_PATH="${HEALTH_PATH:-/}"
LOG_FILE="${LOG_FILE:-/var/log/website-deploy.log}"
REQUESTED_SHA="${1:-${DEPLOY_SHA:-}}"
STARTED_AT="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
NEW_IMAGE="${IMAGE_NAME}:$(date -u +%Y%m%d%H%M%S)"

log() {
  printf '%s %s\n' "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" "$*" | tee -a "$LOG_FILE"
}

fail() {
  log "failure sha=${REQUESTED_SHA:-unknown} reason=$*"
  exit 1
}

health_check() {
  url="$1"
  attempt=1

  while [ "$attempt" -le 20 ]; do
    if curl --fail --silent --output /dev/null "$url"; then
      return 0
    fi

    attempt=$((attempt + 1))
    sleep 1
  done

  return 1
}

run_git() {
  if [ "$(id -u)" -eq 0 ] && [ -n "$REPO_USER" ] && id "$REPO_USER" >/dev/null 2>&1; then
    sudo -u "$REPO_USER" -H git -C "$REPO_DIR" "$@"
    return
  fi

  git -C "$REPO_DIR" "$@"
}

log "deploy_start branch=$BRANCH requested_sha=${REQUESTED_SHA:-latest} started_at=$STARTED_AT"

cd "$REPO_DIR" || fail "repo_dir_not_found"

run_git fetch origin "$BRANCH" || fail "git_fetch_failed"
run_git checkout "$BRANCH" || fail "git_checkout_failed"
run_git reset --hard "origin/$BRANCH" || fail "git_reset_failed"

CURRENT_SHA="$(run_git rev-parse HEAD)"

if [ -n "$REQUESTED_SHA" ] && [ "$CURRENT_SHA" != "$REQUESTED_SHA" ]; then
  fail "sha_mismatch current=$CURRENT_SHA requested=$REQUESTED_SHA"
fi

docker build -t "$NEW_IMAGE" . || fail "docker_build_failed sha=$CURRENT_SHA"

OLD_CONTAINER_ID="$(docker ps -aq -f "name=^/${CONTAINER_NAME}$" || true)"
OLD_IMAGE=""

if [ -n "$OLD_CONTAINER_ID" ]; then
  OLD_IMAGE="$(docker inspect "$CONTAINER_NAME" --format "{{.Config.Image}}" || true)"
fi

STALE_CANDIDATE_ID="$(docker ps -aq -f "name=^/${CANDIDATE_CONTAINER_NAME}$" || true)"

if [ -n "$STALE_CANDIDATE_ID" ]; then
  docker rm -f "$CANDIDATE_CONTAINER_NAME" >/dev/null 2>&1 || fail "candidate_cleanup_failed sha=$CURRENT_SHA"
fi

docker run -d \
  --name "$CANDIDATE_CONTAINER_NAME" \
  -p "127.0.0.1:${CANDIDATE_APP_PORT}:${CONTAINER_PORT}" \
  "$NEW_IMAGE" >/dev/null || fail "candidate_run_failed sha=$CURRENT_SHA"

CANDIDATE_HEALTH_URL="http://127.0.0.1:${CANDIDATE_APP_PORT}${HEALTH_PATH}"

if ! health_check "$CANDIDATE_HEALTH_URL"; then
  docker logs "$CANDIDATE_CONTAINER_NAME" 2>&1 | tail -n 80 | tee -a "$LOG_FILE" || true
  docker rm -f "$CANDIDATE_CONTAINER_NAME" >/dev/null 2>&1 || true
  fail "candidate_health_check_failed sha=$CURRENT_SHA url=$CANDIDATE_HEALTH_URL"
fi

docker rm -f "$CANDIDATE_CONTAINER_NAME" >/dev/null 2>&1 || fail "candidate_rm_failed sha=$CURRENT_SHA"

if [ -n "$OLD_CONTAINER_ID" ]; then
  docker stop "$CONTAINER_NAME" || fail "docker_stop_failed sha=$CURRENT_SHA"
  docker rm "$CONTAINER_NAME" || fail "docker_rm_failed sha=$CURRENT_SHA"
fi

docker run -d \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  -p "127.0.0.1:${APP_PORT}:${CONTAINER_PORT}" \
  "$NEW_IMAGE" || fail "docker_run_failed sha=$CURRENT_SHA"

HEALTH_URL="http://127.0.0.1:${APP_PORT}${HEALTH_PATH}"

if ! health_check "$HEALTH_URL"; then
  docker logs "$CONTAINER_NAME" 2>&1 | tail -n 80 | tee -a "$LOG_FILE" || true
  docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true

  if [ -n "$OLD_IMAGE" ]; then
    docker run -d \
      --name "$CONTAINER_NAME" \
      --restart unless-stopped \
      -p "127.0.0.1:${APP_PORT}:${CONTAINER_PORT}" \
      "$OLD_IMAGE" >/dev/null || fail "rollback_run_failed sha=$CURRENT_SHA old_image=$OLD_IMAGE"

    if health_check "$HEALTH_URL"; then
      fail "health_check_failed_rolled_back sha=$CURRENT_SHA url=$HEALTH_URL old_image=$OLD_IMAGE"
    fi

    fail "rollback_health_check_failed sha=$CURRENT_SHA url=$HEALTH_URL old_image=$OLD_IMAGE"
  fi

  fail "health_check_failed sha=$CURRENT_SHA url=$HEALTH_URL"
fi

ENDED_AT="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
docker image ls "$IMAGE_NAME" --format "{{.Repository}}:{{.Tag}}" |
  while IFS= read -r image; do
    if [ "$image" != "$NEW_IMAGE" ] && [ "$image" != "$OLD_IMAGE" ]; then
      docker image rm "$image" >/dev/null 2>&1 || true
    fi
  done
log "deploy_success sha=$CURRENT_SHA image=$NEW_IMAGE started_at=$STARTED_AT ended_at=$ENDED_AT"
