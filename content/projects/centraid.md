---
title: CentraID
summary: Full-stack capstone attendance platform connecting a NestJS/PostgreSQL backend, Expo mobile app, and Raspberry Pi reader service for classroom check-ins.
year: 2026
status: Completed prototype
tags:
  - NestJS
  - PostgreSQL
  - Docker
  - RFID
  - CI/CD
order: 3
coverImage: /images/projects/centraid/cover.svg
---

CentraID was my capstone project: a classroom attendance system built around the idea that attendance should be verified through the classroom environment, not just a direct app-to-server button.

The system combined three main pieces:

- a NestJS and PostgreSQL backend for identity, courses, schedules, reader devices, session control, attendance records, and review workflows
- an Expo and React Native mobile app for student and instructor flows, including login, device binding, schedules, attendance history, event sessions, and reader-mediated check-in
- a Python reader service designed for Raspberry Pi-style deployment, with local health/check-in endpoints, backend heartbeats, RFID input support, SQLite dedupe, and Dockerized demo scripts

My strongest ownership was on the backend, reader integration, and delivery side of the project. I worked on the API shape, TypeORM entities, attendance validation, reader heartbeat flow, Docker setup, CI quality gate, demo runbooks, and the documentation that helped a six-person team keep moving in the same direction.

The interesting engineering problem was balancing a mobile-friendly experience with stronger classroom-presence semantics. Instead of letting a student app write attendance directly to the backend, the mobile flow goes through the reader. The reader receives the active session state from the backend, exposes a local check-in path, applies throttling and dedupe, and forwards attendance events for final validation.

That made the project a good bridge between application development and systems work: API design, auth, scheduling, hardware-adjacent RFID handling, local/offline state, containerized deployment, and team process all had to fit together for the prototype to work.
