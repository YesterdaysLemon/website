---
title: ForgeWard
summary: "A model-agnostic, security-first software delivery harness that turns specialist model roles into a gated SDLC with human approvals and inspectable evidence."
year: 2026
status: Public alpha
tags:
  - Python
  - Pydantic
  - AI orchestration
  - Secure SDLC
  - LiteLLM
  - CI/CD
repoUrl: https://github.com/YesterdaysLemon/forgeward
coverImage: /images/projects/forgeward/site-preview.png
order: 1
---

<!-- personal-notes -->

I built ForgeWard after getting curious about the gap between “several model personas said the code looks good” and an actual software delivery process. The fun part is the little firm: product, design, architecture, scrum, engineering, security, testing, review, and release roles. The important part is the ward around them.

Models can propose work, but ordinary Python owns the state machine, context limits, path rules, budgets, verification commands, evidence, and human approval gates. It is intentionally much less exciting than giving a model an unrestricted shell and hoping everybody has a nice afternoon.

The repository is public because I wanted the security claims, tradeoffs, and rough edges to be inspectable. It is still alpha software, but it already has a credential-free demo path, real provider adapters, Docker packaging, cross-platform CI, CodeQL, and enough documentation to explain both what it does and what it absolutely does not guarantee.

<!-- ai-summary -->

ForgeWard is a Python CLI and reusable Codex skill for coordinating model-assisted software work through a deterministic secure-development lifecycle.

An engagement moves through intake, discovery, design, a human plan gate, execution, independent verification, and a human release gate. Specialist workers produce typed artifacts such as requirements, threat models, architecture decisions, file proposals, reviews, and release notes. The orchestration engine—not the models—controls transitions and validates outputs.

The safety layer includes bounded repository context, protected paths, clean-worktree enforcement, allowlisted project checks, secret redaction, structured file proposals, artifact integrity checks, and a hash-chained evidence ledger. ForgeWard supports OpenAI-compatible HTTP endpoints, an optional LiteLLM adapter for additional providers, and an offline demo provider that exercises the lifecycle without credentials.

The public repository includes the CLI, prompts, project templates, bundled skill, Docker images, a static product site, architecture and threat-model documentation, cross-platform tests, CI, CodeQL, Dependabot, and vulnerability-reporting support.
