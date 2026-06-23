---
title: Central Deploy Manager
summary: Signed webhook and Docker rollout manager for deploying multiple small web apps on one VPS behind Caddy subdomains.
year: 2026
status: Live infrastructure
tags:
  - Node.js
  - Docker
  - Caddy
  - GitHub Actions
  - VPS
repoUrl: https://github.com/YesterdaysLemon/deploy-manager
order: 1
---

<!-- personal-notes -->

<!-- ai-summary -->

Central Deploy Manager is the deployment layer I built to move my personal VPS from a one-off portfolio deployment into a small multi-app hosting setup.

The manager exposes a signed webhook endpoint, maps app IDs to root-owned deployment config files, and runs a shared Docker rollout script for each app. The rollout keeps the pattern I wanted from the original website deploy: build the image, start a candidate container on a temporary loopback port, health-check it, then swap the production container only after the candidate passes.

The system currently supports the portfolio site, Aquarium, and Bird of the Day from one server. Caddy handles the public domains and TLS, while Docker containers stay bound to `127.0.0.1` on app-specific ports.

The part I like most is that adding another app is mostly configuration: clone a repo, give it a Dockerfile and health endpoint, add one app env file, add one allowlist entry, and point a GitHub Actions workflow at the central deploy endpoint.
