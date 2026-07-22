---
title: Central Deploy Manager
summary: "The deployment plumbing behind this site and its smaller siblings: signed webhooks, health-checked Docker rollouts, and Caddy routing on one VPS."
year: 2026
status: Live infrastructure
tags:
  - Node.js
  - Docker
  - Caddy
  - GitHub Actions
  - VPS
repoUrl: https://github.com/YesterdaysLemon/deploy-manager
coverImage: /images/projects/central-deploy-manager/central-deploy.png
order: 3
---

<!-- personal-notes -->

I built this because copying a slightly different deployment setup into every tiny side project was getting old fast. I wanted each app to own its code and Dockerfile while one boring, predictable service handled the dangerous bit on the server.

Now a new app mostly needs a health endpoint, a small config file, and a webhook secret. The manager builds a candidate container, checks that it is alive, and only then swaps it into production. It is not the flashiest project here, but it is the reason the flashier ones can live on their own subdomains without me manually babysitting every deploy.

<!-- ai-summary -->

Central Deploy Manager is the deployment layer I built to move my personal VPS from a one-off portfolio deployment into a small multi-app hosting setup.

The manager exposes a signed webhook endpoint, maps app IDs to root-owned deployment config files, and runs a shared Docker rollout script for each app. The rollout keeps the pattern I wanted from the original website deploy: build the image, start a candidate container on a temporary loopback port, health-check it, then swap the production container only after the candidate passes.

The system currently supports the portfolio site, Aquarium, and Bird of the Day from one server. Caddy handles the public domains and TLS, while Docker containers stay bound to `127.0.0.1` on app-specific ports.

The part I like most is that adding another app is mostly configuration: clone a repo, give it a Dockerfile and health endpoint, add one app env file, add one allowlist entry, and point a GitHub Actions workflow at the central deploy endpoint.
