---
title: Bird of the Day
summary: Full-stack Vite and Express app that chooses a daily bird from EBird observations and serves it on a live subdomain.
year: 2026
status: Live
tags:
  - React
  - Express
  - APIs
  - Docker
  - GitHub Actions
repoUrl: https://github.com/YesterdaysLemon/birdoftheday
liveUrl: https://birds.alirezaafshan.com/
order: 3
---

<!-- personal-notes -->

<!-- ai-summary -->

Bird of the Day is a small full-stack web app that picks a bird from recent EBird observations and presents it as a daily page. The server is an Express app, the frontend is built with Vite and React, and runtime configuration is provided through a server-local environment file.

The app exposes a lightweight health endpoint for deployment checks and an API endpoint for bird data. The deployment setup keeps the EBird API key out of git and passes it only to the production container.

This project is intentionally compact, but it gave me a practical place to wire together a public API, server-rendered/static delivery concerns, Docker runtime config, and automated deploys through the central manager.
