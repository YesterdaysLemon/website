---
title: Building a File-Based Personal Site
summary: Why a small personal site does not need a full CMS to feel maintainable.
publishedAt: 2026-04-18
tags:
  - Site
  - Markdown
  - Workflow
coverImage: /images/blog/building-a-file-based-site/cover.svg
---

For a personal site, the simplest workflow is usually the best one.

If content lives in markdown files, the editing model is easy to understand:

1. write or update a file
2. commit the change
3. push it
4. let CI deploy the site

That keeps the content versioned alongside the code and avoids introducing a second system just to publish a few projects or posts.

It also makes it easier to refactor the front end later, because the content stays portable.
