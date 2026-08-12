---
title: RetainerProof
summary: A private, production-shaped client value ledger that turns promised outcomes and source-backed proof into monthly briefs, client pulse signals, and transparent renewal readiness.
year: 2026
status: Private design-partner MVP
tags:
  - Next.js
  - PostgreSQL
  - Multi-tenant SaaS
  - Background jobs
  - Docker
order: 7
---

<!-- personal-notes -->

RetainerProof came from a mundane but expensive problem: recurring service work can be valuable while remaining almost invisible. The evidence is scattered across calls, dashboards, screenshots, and documents, then somebody has to reconstruct the story right before a review or renewal.

The product keeps that story continuous: promised outcomes become proof receipts, receipts become a monthly brief, private client feedback feeds the next cycle, and renewal readiness stays explainable rather than turning into a mysterious score.

This is a private design-partner MVP, not a launched SaaS or a claim that software can predict whether a client will renew.

<!-- ai-summary -->

RetainerProof is a multi-tenant Next.js and PostgreSQL application with database sessions, onboarding, retainer and outcome tracking, source-backed proof receipts, private client-facing brief links, background jobs, email flows, and audit-friendly renewal readiness.

The Docker Compose demo profile provisions a fictional workspace, runs migrations and a worker, and captures mail locally. Demo data is profile-gated so production orchestration cannot accidentally depend on it.
