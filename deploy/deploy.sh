#!/usr/bin/env sh
set -eu

ENV_FILE="${ENV_FILE:-/etc/website-deploy.env}"

if [ -r "$ENV_FILE" ]; then
  set -a
  . "$ENV_FILE"
  set +a
fi

REPO_DIR="${REPO_DIR:-/opt/website/app}"
BRANCH="${DEPLOY_BRANCH:-${BRANCH:-master}}"
IMAGE_NAME="${IMAGE_NAME:-website-app}"
CONTAINER_NAME="${CONTAINER_NAME:-website-app}"
APP_PORT="${APP_PORT:-3000}"
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

log "deploy_start branch=$BRANCH requested_sha=${REQUESTED_SHA:-latest} started_at=$STARTED_AT"

cd "$REPO_DIR" || fail "repo_dir_not_found"

git fetch origin "$BRANCH" || fail "git_fetch_failed"
git checkout "$BRANCH" || fail "git_checkout_failed"
git reset --hard "origin/$BRANCH" || fail "git_reset_failed"

CURRENT_SHA="$(git rev-parse HEAD)"

if [ -n "$REQUESTED_SHA" ] && [ "$CURRENT_SHA" != "$REQUESTED_SHA" ]; then
  fail "sha_mismatch current=$CURRENT_SHA requested=$REQUESTED_SHA"
fi

docker build -t "$NEW_IMAGE" . || fail "docker_build_failed sha=$CURRENT_SHA"

OLD_CONTAINER_ID="$(docker ps -aq -f "name=^/${CONTAINER_NAME}$" || true)"

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
ATTEMPT=1

while [ "$ATTEMPT" -le 20 ]; do
  if curl --fail --silent --output /dev/null "$HEALTH_URL"; then
    ENDED_AT="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
    docker image ls "$IMAGE_NAME" --format "{{.Repository}}:{{.Tag}}" |
      while IFS= read -r image; do
        if [ "$image" != "$NEW_IMAGE" ]; then
          docker image rm "$image" >/dev/null 2>&1 || true
        fi
      done
    log "deploy_success sha=$CURRENT_SHA image=$NEW_IMAGE started_at=$STARTED_AT ended_at=$ENDED_AT"
    exit 0
  fi

  ATTEMPT=$((ATTEMPT + 1))
  sleep 1
done

fail "health_check_failed sha=$CURRENT_SHA url=$HEALTH_URL"
