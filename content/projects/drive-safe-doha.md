---
title: Drive Safe Doha
summary: React Native proof of concept for vehicle access approval, using Firebase, camera capture, image upload, and real-time owner review.
year: 2025
status: Proof of concept
tags:
  - React Native
  - Expo
  - Firebase
  - Mobile
  - Verification
order: 1
coverImage: /images/projects/drive-safe-doha/cover.svg
---

<!-- personal-notes -->

<!-- ai-summary -->

Drive Safe Doha was built as a mobile proof of concept for a Qatar Ministry of Education-aligned student project. The goal was to make vehicle access more accountable by routing driver approval through an app instead of treating access as an invisible background event.

The app was structured around two modes:

- a car-side flow that captures a front-facing photo, uploads it to Firebase Storage, and creates a pending ride request in Firestore
- an owner-side flow that listens for ride requests in real time, reviews the image, and approves or denies the request

I built the prototype with Expo Router, React Native, NativeWind, Firebase Auth, Firestore, Firebase Storage, and Expo Camera. The implementation focused on getting the end-to-end verification loop working: create a request, attach visual evidence, notify the owner through shared cloud state, and route the car-side UI to success or unauthorized states based on the decision.

The project was intentionally lightweight, but it taught a useful lesson about product translation. The technical work was less about building a polished production security system and more about turning a team concept into a working mobile demo that nontechnical stakeholders could understand quickly.

The same app structure later became a useful starting point for the QR attendance proof of concept: file-based routing, Firebase-backed state, reusable form/storage helpers, and mobile permission handling were all patterns that carried forward.
