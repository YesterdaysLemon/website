---
title: Bird of the Day
summary: A tiny daily bird site powered by recent eBird observations, a small Express API, and an unreasonable amount of affection for birds.
year: 2026
status: Live and chirping
tags:
  - React
  - Express
  - APIs
  - Docker
  - GitHub Actions
liveUrl: https://birds.alirezaafshan.com/
coverImage: /images/projects/birdoftheday/bird.png
order: 12
---

<!-- personal-notes -->

I wanted one small website that did exactly one delightful thing. It picks a bird from recent observations, gives it the front page for the day, and fills in enough context to make the visit worth it.

The app is intentionally compact, but I still treated it like a real service: API keys stay on the server, deployment config stays out of git, and a health check lets the deploy manager know whether a new version is safe to keep. A silly idea is more fun when the infrastructure is not silly too.

<!-- ai-summary -->

Bird of the Day is a small full-stack web app that picks a bird from recent eBird observations and presents it as a daily page. The server is an Express app, the frontend is built with Vite and React, and runtime configuration is provided through a server-local environment file.

The app exposes a lightweight health endpoint for deployment checks and an API endpoint for bird data. The deployment setup keeps the eBird API key out of git and passes it only to the production container.

This project is intentionally compact, but it gave me a practical place to wire together a public API, server-rendered/static delivery concerns, Docker runtime config, and automated deploys through the central manager.
