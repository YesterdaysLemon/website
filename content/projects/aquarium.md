---
title: Aquarium
summary: Interactive Three.js aquarium scene deployed as a static Dockerized web app on a dedicated subdomain.
year: 2026
status: Live
tags:
  - React
  - Three.js
  - Docker
  - Caddy
  - WebGL
repoUrl: https://github.com/YesterdaysLemon/aquarium
liveUrl: https://fish.alirezaafshan.com/
coverImage: public/images/projects/aquarium/aquarium.png
order: 2
---

<!-- personal-notes -->

<!-- ai-summary -->

Aquarium is a browser-based 3D scene built with React, Three.js, and Vite. It focuses on a quiet interactive fish-tank experience: animated fish, underwater atmosphere, species selection, camera controls, and responsive UI around the scene.

The app builds into static assets served by an nginx Docker image. On the VPS it runs behind Caddy at `fish.alirezaafshan.com`, with deploys handled by the central deploy manager and GitHub Actions.

This project was a useful frontend exercise because it combines visual design, real-time rendering, asset preparation, performance tradeoffs, and deployment details. The app itself is playful, but the delivery path is the same shape I want for future small web experiments: a focused repo, a Dockerfile, health-checked rollout, and a stable subdomain.
