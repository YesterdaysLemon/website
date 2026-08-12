---
title: "Astralbound: First Duel"
summary: An original Godot 4 vertical slice with an explorable magical hub and a complete, repeatable card duel built around readable enemy intent, mana, wards, status effects, and real win/loss states.
year: 2026
status: Private game vertical slice
tags:
  - Godot
  - GDScript
  - Turn-based combat
  - Game systems
  - Headless tests
order: 8
---

<!-- personal-notes -->

This one exists because sometimes a systems problem should have wizards in it.

The slice lets a player explore the Astral Commons, approach the Briar Gate, and challenge its Warden. The fight is small enough to understand but complete enough to replay: four player spells, telegraphed enemy choices, mana, wards, Burn, Weaken, healing, victory, defeat, and a rematch.

It is an original private prototype with procedural vector presentation and no borrowed game assets. The milestone is intentionally one polished duel, not a disguised promise of a giant RPG.

<!-- ai-summary -->

Astralbound: First Duel is a Godot 4 project with one explorable overworld hub and one full turn-based combat encounter. The Warden evaluates health and mana, announces intent, and can attack, defend, or heal.

The combat model is separated from presentation and has headless checks for initial state, shielding, turn exchange, player victory, and enemy victory. World transitions, deck building, quests, progression, and save data remain future scope.
