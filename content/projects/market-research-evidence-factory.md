---
title: Market Research Evidence Factory
summary: Private, local-first tooling for immutable market-data evidence, deterministic normalization, frozen offline experiments, and reports that keep plumbing checks separate from effectiveness claims.
year: 2026
status: Exploratory — private
tags:
  - Python
  - Data provenance
  - Immutable evidence
  - Offline evaluation
  - Security boundaries
order: 9
---

<!-- personal-notes -->

This project is intentionally less interested in “finding a strategy” than in eliminating the many ways a strategy can look good for the wrong reason.

The system records raw public historical responses with provenance and hashes, normalizes them into deterministic tables, freezes experiments before evaluation, and keeps credentials and order paths outside ordinary research. Even the demo integration path is labeled as plumbing evidence rather than performance evidence.

The repository and its artifacts are private. Results stay exploratory until their predeclared promotion gates pass.

<!-- ai-summary -->

The evidence factory is a Python library and CLI for reproducible historical market research. It uses fail-closed cache containment, immutable raw publication, canonical normalized tables, explicit request manifests, byte hashes, point-in-time selection, and deterministic offline reporting.

Production access is restricted to anonymous public market-data reads. Credentialed portfolio and order endpoints are excluded from the research path, and demo order-lifecycle checks cannot be promoted as research evidence.
