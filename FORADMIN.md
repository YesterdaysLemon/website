# Admin Notes

Operational notes for reading deploy logs and checking the website server.

## Deploy Log

The deploy log path is configured by `LOG_FILE` in `/etc/website-deploy.env`.
The current expected path is:

```bash
/opt/website/deploy.log
```

Useful read command:

```bash
tail -n 80 /opt/website/deploy.log
```

## Expected Success Flow

A normal deploy should show:

```text
deploy_start branch=master requested_sha=<sha> started_at=<time>
deploy_success sha=<sha> image=website-app:<timestamp> started_at=<time> ended_at=<time>
```

The deploy script now uses a candidate container before touching production:

- Build `website-app:<timestamp>`.
- Start `website-app-candidate` on `127.0.0.1:3001`.
- Health-check the candidate.
- Remove the candidate.
- Replace `website-app` on `127.0.0.1:3000`.
- Health-check production.

The preferred health path is `/healthz`.

## Failure Messages

- `git_fetch_failed`, `git_checkout_failed`, or `git_reset_failed`: the repo could not update to the requested branch/SHA.
- `sha_mismatch`: GitHub requested one SHA, but the server repo resolved to another SHA.
- `docker_build_failed`: Docker image build failed; production should still be running.
- `candidate_cleanup_failed`: an old candidate container could not be removed.
- `candidate_run_failed`: the candidate container could not start on the candidate port.
- `candidate_health_check_failed`: candidate did not pass health check; production should still be running.
- `candidate_rm_failed`: candidate passed health check but could not be removed before production swap.
- `docker_stop_failed` or `docker_rm_failed`: old production container could not be stopped/removed.
- `docker_run_failed`: new production container could not start after the old one was removed.
- `health_check_failed_rolled_back`: new production failed health check and the old image was restarted successfully.
- `rollback_run_failed`: new production failed and the old image could not be restarted.
- `rollback_health_check_failed`: old image restarted but did not pass health check.
- `health_check_failed`: new production failed and no old image was available for rollback.

## Image Retention

The deploy script keeps two images after a successful deploy:

- the new current image, `NEW_IMAGE`
- the image that was running before the deploy, `OLD_IMAGE`

Older `website-app:*` images are pruned after success.

This means there is one automatic rollback image available. It does not keep two
previous rollback images. To keep the current image plus two previous images,
the pruning logic in `deploy/deploy.sh` needs another retention pass.

## Quick Checks

Public checks:

```bash
curl -I https://alirezaafshan.com/
curl -I https://alirezaafshan.com/healthz
curl -I https://alirezaafshan.com/robots.txt
```

Server checks that require admin sudo:

```bash
sudo docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
sudo docker inspect website-app --format 'Configured user: {{.Config.User}}'
sudo docker exec website-app id
sudo docker image ls website-app
systemctl status website-deploy --no-pager
systemctl status caddy --no-pager
```

Expected container user:

```text
Configured user: node
uid=1000(node) gid=1000(node) groups=1000(node)
```

## Access Notes

- `codex` is intentionally unprivileged and should not have Docker access.
- `ali` is the human admin user and should use `sudo` for Docker administration.
- `website-deploy` runs the webhook and should only have narrow deploy sudo.
