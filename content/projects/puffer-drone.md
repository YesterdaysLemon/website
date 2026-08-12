---
title: Puffer Drone
summary: A reproducible PufferLib training harness where one compact policy stabilizes and races 2,048 batched Crazyflie-style drones through randomized 3D rings, backed by a measured and hash-checked baseline.
year: 2026
status: Public measured ML experiment
tags:
  - Python
  - PufferLib
  - Reinforcement learning
  - CUDA
  - Docker
  - Reproducibility
repoUrl: https://github.com/YesterdaysLemon/puffer-drone
order: 5
---

<!-- personal-notes -->

Puffer Drone asks one small policy to learn two related jobs: hold a hover and race through a procedural ten-ring course. The fun part is watching a swarm of drones learn at unreasonable speed. The useful part is everything around the training run that makes the result replayable instead of anecdotal.

The published reference trained from scratch, then evaluated 598 episodes. Its artifact bundle keeps the raw log, effective configuration, checkpoint, report, learning curve, environment record, and hashes together. The headline numbers are visible, but so is the boundary: this is a compact policy in PufferLib&apos;s configured simulator, not evidence that a real quadrotor learned to fly.

<!-- ai-summary -->

Puffer Drone wraps PufferLib's native `ocean/drone` environment in a pinned, containerized, reproducible workflow. Native C physics runs at 500 Hz, the policy acts at 100 Hz, and 2,048 agents are batched for GPU training across hover and randomized ring-race tasks.

The checked-in baseline was trained for 88,604,672 vectorized agent steps and evaluated across 598 episodes. It averaged 8.849 rings per ten-ring race, completed 40.8% of races, and recorded zero hover out-of-bounds events in that configured evaluation distribution.

Validation covers configuration, native vectorization invariants, report generation, source compilation, and artifact checksums. The repository pins its upstream PufferLib revision and publishes the starting configuration, resolved run settings, checkpoint, raw log, derived metrics, learning curve, environment record, and SHA-256 manifest together.
