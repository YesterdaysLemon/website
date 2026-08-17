---
title: C. elegans Connectome Simulator
summary: A public scientific-computing lab running 302 graded-potential neurons, 95 body-wall muscles, an inextensible low-Reynolds-number body, and a browser viewer as one closed loop.
year: 2026
status: Live public simulation lab
tags:
  - Python
  - Scientific computing
  - Connectomics
  - Biomechanics
  - Browser visualization
repoUrl: https://github.com/YesterdaysLemon/celegans-sim
liveUrl: https://worm.alirezaafshan.com
coverImage: /images/projects/celegans-sim/viewer-animal.png
order: 4
---

<!-- personal-notes -->

This is the sort of project that begins with “could I simulate the whole worm?” and only later admits that the word “whole” has become a systems-design problem.

The model closes the loop from a chemical and physical world, through sensory neurons and the reconstructed connectome, into individual muscle cells and an inextensible body moving through a viscous medium. The browser is deliberately just the viewer; the simulation remains the project.

It is an open work in progress with a public browser viewer, and it is not presented as a biologically complete digital animal or an OpenWorm result. The value so far is in making every subsystem explicit enough to measure, test, and replace.

<!-- ai-summary -->

The simulator is a Python scientific-computing system with a browser front end. It models 302 predominantly non-spiking neurons using graded membrane dynamics and anatomically derived chemical and gap-junction connectivity. Motor output drives 95 body-wall muscle cells, which generate bending moments for an inextensible body in a zero-Reynolds-number environment.

The world includes food, chemical and thermal gradients, obstacles, and proprioceptive feedback. Headless runs, diagnostic kymographs, gait metrics, and subsystem timing make the closed loop inspectable without the viewer.
