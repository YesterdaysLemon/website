---
title: Canopy Slice Aviary
summary: A living 3D glasshouse aviary backed by a fail-safe weekly asset pipeline that quarantines, validates, optimizes, and provenance-tracks generated bird models before publication.
year: 2026
status: Public prototype
tags:
  - React Three Fiber
  - Fastify
  - PostgreSQL
  - 3D asset pipeline
  - Playwright
repoUrl: https://github.com/YesterdaysLemon/aviary
order: 6
---

<!-- personal-notes -->

The visible project is a warm little glasshouse full of birds. The less visible project is the machinery that refuses to let a questionable generated asset take down the glasshouse.

Visitors can orbit the habitat, focus individual birds, and browse a dated catalog. Behind that, a weekly worker chooses a non-repeating species, creates candidates, downloads temporary provider results immediately, quarantines them, validates their geometry and animation suitability, optimizes approved GLBs, and only then updates the catalog. If the run fails, the last good aviary stays live.

That combination is what I like about it: a gentle front end resting on fairly suspicious infrastructure.

<!-- ai-summary -->

Canopy Slice uses React, TypeScript, React Three Fiber, Drei, and Three.js for the habitat. A typed Fastify API, PostgreSQL-backed worker, protected curator surface, and swappable storage layer support the asset pipeline.

Generated GLBs are treated as untrusted input. The pipeline performs quarantine, glTF validation, normalization, level-of-detail generation, Meshopt optimization, content-addressed publication, and catalog provenance tracking. Unit, integration, asset-pipeline, Playwright, and Docker smoke checks cover the system.
