---
title: React Native Cloud Prototypes
summary: Pair of Expo and Firebase mobile proofs of concept covering vehicle approval and QR attendance workflows.
year: 2025
status: Proofs of concept
tags:
  - React Native
  - Expo
  - Firebase
  - Mobile
  - Cloud Database
order: 5
coverImage: images/projects/drive-safe-doha/cover.svg
---

<!-- personal-notes -->

<!-- ai-summary -->

These two React Native prototypes explored the same core mobile pattern in different domains: use a phone app as the user-facing surface, use Firebase for cloud-backed state, and make the workflow visible through live updates rather than static forms.

Drive Safe Doha was a vehicle approval proof of concept. A car-side flow captured a photo, uploaded it to Firebase Storage, and created a pending request in Firestore. An owner-side flow listened for new requests, reviewed the image, and approved or denied access.

QR Attendance Verification adapted the same Expo/Firebase foundation for an education workflow. A teacher generated a class QR code, students scanned it with their phone camera, and Firestore reflected live attendance state for the roster.

Neither project was intended as a production security system. They were useful because they made the mobile-to-cloud loop concrete: routing, camera permissions, image or QR handling, real-time database updates, and role-specific screens all had to work together.
