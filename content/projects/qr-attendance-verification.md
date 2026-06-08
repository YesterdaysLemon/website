---
title: QR Attendance Verification
summary: Expo and Firebase attendance proof of concept with teacher-generated QR codes, student camera scanning, and live Firestore roster updates.
year: 2025
status: Proof of concept
tags:
  - React Native
  - Expo
  - Firebase
  - QR Codes
  - Education
order: 2
coverImage: /images/projects/qr-attendance-verification/cover.svg
---

<!-- personal-notes -->

<!-- ai-summary -->

QR Attendance Verification adapted the earlier mobile architecture into a narrower education workflow: let a teacher open a class, display a QR code, and let students mark themselves present by scanning it from their phones.

The prototype used Expo Router and React Native for the mobile app, Firebase Auth and Firestore for account/data handling, `react-native-qrcode-svg` for QR generation, and Expo Camera for the student scanning flow.

The teacher side kept a class roster in Firestore, subscribed to live changes, generated a class-specific attendance QR code, and provided simple filters for present/not-present students. The student side requested camera permission, scanned the QR payload, validated it against the selected class, and updated the Firestore roster when the scan matched.

This was a useful follow-on project because it reused the practical pieces from Drive Safe while changing the domain. Instead of rebuilding the mobile foundation, I could focus on the attendance interaction: route structure, camera permissions, QR validation, shared cloud state, and a teacher-facing view that made the result visible immediately.

The project also helped clarify what a more serious attendance system would need later: stronger identity binding, session windows, reader/proximity checks, and backend-side validation. Those gaps directly informed the later CentraID architecture.
