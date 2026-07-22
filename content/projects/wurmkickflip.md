---
title: Wurmkickflip
summary: An extremely serious physics experiment about teaching a worm to ride a skateboard. The physics works; the worm remains a work in progress.
year: 2026
status: Under construction
tags:
  - React
  - Three.js
  - Rapier
  - ONNX Runtime
  - Python
repoUrl: https://github.com/YesterdaysLemon/wurmkickflip
order: 8
---

<!-- personal-notes -->

This started with a very reasonable question: could I teach a simulated worm to do a kickflip? It has since become a browser physics lab with procedural terrain, several questionable creatures, a skateboard, and a training setup waiting in the wings.

The default controller is still a scripted muscle wave, so I am not claiming the worm has achieved machine intelligence or even basic coordination. That is what makes it fun. The scene works, the parts flop around convincingly, and there is a clear path for testing trained policies without pretending the experiment is further along than it is.

<!-- ai-summary -->

Wurmkickflip is a React, Three.js, and Rapier prototype for experimenting with physics creatures riding a skateboard in a small procedural terrarium.

The browser app includes selectable creature shapes, terrain presets, rigid-body skateboard parts, and deterministic muscle-wave control. It also defines an observation and action contract for optional ONNX Runtime policies through WebAssembly or WebGPU, while keeping scripted control as the fast and reliable default.

A separate Python 3.11 training workspace provides Gymnasium and Stable Baselines3 scaffolding, ONNX export and validation, and an evolution experiment for creature and controller parameters. The learned-controller side is still experimental; the current public repo is best understood as a working physics playground with a deliberately unfinished training path.
