---
title: Open Mathematics Research Lab
summary: Three public, verifier-first explorations of Conway-99, an Erdős covering problem, and the Krenn–Gu conjecture—publishing exact finite or conditional progress while keeping every global problem explicitly unresolved.
year: 2026
status: Exploratory — unresolved
tags:
  - Python
  - Exact computation
  - Independent verification
  - Research provenance
  - Open mathematics
repoUrl: https://github.com/YesterdaysLemon/conway-99-research
order: 2
---

<!-- personal-notes -->

I wanted to see what a long-running Codex research program looked like when the interesting part was not a dramatic answer, but whether each small claim could survive an independent replay.

That produced three public research repositories: [Conway-99](https://github.com/YesterdaysLemon/conway-99-research), an [Erdős \(2^k3^\ell m+1\) cover search](https://github.com/YesterdaysLemon/erdos-2-3-cover-search), and work on the [Krenn–Gu monochromatic quantum-graph conjecture](https://github.com/YesterdaysLemon/krenn-gu-research). They contain exact certificates, adversarial verifiers, frozen checkpoints, and a large number of carefully scoped dead ends.

None of the three global problems is solved. That sentence is not fine print; it is a design requirement. The useful outcome is a public record of finite obstructions, conditional bounds, analytic reductions, failed branches, and the machinery needed to check them without trusting the discovery process.

<!-- ai-summary -->

The Open Mathematics Research Lab is a portfolio grouping for three evidence-gated repositories.

The Conway-99 project studies the possible strongly regular graph `srg(99,14,1,2)` through exact combinatorial, code, lattice, and local-structure constraints. The Erdős project searches periodic affine cover families and publishes independently replayable no-cover certificates for finite families. The Krenn–Gu project combines symbolic algebra, finite search, and analytic reductions around a monochromatic quantum-graph prize conjecture.

Each repository separates global resolution from finite, conditional, exploratory, or pending results. Discovery code cannot certify itself: promoted claims have separate verifier paths, frozen inputs, and explicit status boundaries.
