---
title: Wurmkickflip
summary: A deterministic neural-worm terrarium with contact-driven boarding, randomized Seed Forge worlds, causal control lanes, and checksummed replay—plus one unapologetically scripted aerial kickflip.
year: 2026
status: Public research playground
tags:
  - React
  - Three.js
  - Recurrent controller
  - Deterministic replay
  - Python
repoUrl: https://github.com/YesterdaysLemon/wurmkickflip
order: 3
---

<!-- personal-notes -->

This started with a very reasonable question: could I teach a simulated worm to do a kickflip? It has since become a browser-native terrarium where a 16-segment worm has finite food and water, an evolved recurrent crawl controller, a skateboard, and a small laboratory for asking whether the controller is actually responsible for what visitors see.

The honesty boundary is part of the project. Crawling, seeking, and boarding are neural and contact-driven. Eating poses, dismounting, board routing, and the aerial stunt are authored. The result is more interesting than pretending the entire routine was learned: the browser can compare the live controller against zero-command and frozen-controller lanes, replay the same randomized worlds, and show exactly where control changes hands.

<!-- ai-summary -->

Wurmkickflip is a React and Three.js simulation built around a deterministic 60 Hz terrarium runtime. A tracked 16-neuron recurrent policy emits dorsal and ventral commands for a free articulated chain, whose motion emerges from internal forces, constraints, terrain friction, and contact.

Seed Forge varies 14 world, terrain, actuator, noise, spawn, and skateboard channels from a reproducible seed. Forge Trials evaluates held-out worlds across neural, zero-command, and frozen-controller lanes and preserves checksummed heat replays for inspection. The live exhibit and headless evaluation share the same episode engine.

These are finite compact-plant evaluations, not evidence of a learned kickflip, biological realism, or transfer to a real soft body. The scripted aerial boundary is visible in the UI and documentation.
