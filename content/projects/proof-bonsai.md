---
title: Proof Bonsai
summary: An interactive, repository-derived map of the Krenn–Gu proof programme that keeps scoped results, open branches, and failed routes visibly distinct while the global conjecture remains unresolved.
year: 2026
status: Live — global conjecture unresolved
tags:
  - React
  - Graph visualization
  - Exact research
  - Evidence provenance
  - Cloudflare
repoUrl: https://github.com/YesterdaysLemon/krenn-gu-research/tree/codex/proof-visualizer-20260811/tools/proof-visualizer
liveUrl: https://proof-bonsai.alirezaafshan.com
coverImage: /images/projects/proof-bonsai/cover.webp
order: 11
---

<!-- personal-notes -->

The Krenn–Gu project accumulated enough reductions, obstructions, exceptional cases, and carefully scoped failures that a flat document stopped being the easiest way to understand it. Proof Bonsai turns that proof topology into something explorable without turning it into a progress bar.

The important part is the boundary. A green leaf means a claim is established at the exact scope shown beside it; it does not mean the prize conjecture is solved. Yellow branches keep open, partial, or conditional work visible, and red scars preserve routes that were refuted, withdrawn, or superseded instead of quietly pruning them from the story.

<!-- ai-summary -->

Proof Bonsai is a public interactive navigator for the Krenn–Gu monochromatic quantum-graph research programme. It generates a deterministic graph snapshot from the repository's canonical frontier document and theorem ledger, then presents the resulting nodes and typed dependencies through a searchable React Flow interface.

Each selected node exposes its exact repository status, owning sources, linked verifier and audit counts, incoming dependencies, and outgoing obligations. The three botanical display states are deliberately a projection rather than a replacement for the underlying evidence semantics, and the interface keeps the global conjecture labeled `UNRESOLVED` throughout.

The site is built with React, vinext, and Cloudflare-compatible tooling. Its useful engineering idea is that the visualization does not become a second hand-maintained source of truth: data sync and tests fail when the checked-in projection drifts from the committed research frontier.
