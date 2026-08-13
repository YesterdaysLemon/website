import assert from "node:assert/strict";
import test from "node:test";

import {
  clampPositionToTable,
  clampStoredPositions,
  getBreakpoint,
} from "../app/lib/home-card-table.ts";

test("home breakpoints follow the rendered card layouts", () => {
  assert.equal(getBreakpoint(639), "mobile");
  assert.equal(getBreakpoint(640), "tablet");
  assert.equal(getBreakpoint(1023), "tablet");
  assert.equal(getBreakpoint(1024), "desktop");
});

test("dropped cards stay inside the playable table bounds", () => {
  assert.deepEqual(
    clampPositionToTable(
      { x: -20, y: 10 },
      { width: 1000, height: 900 },
      "desktop",
    ),
    { x: 120, y: 363.84 },
  );
  assert.deepEqual(
    clampPositionToTable(
      { x: 990, y: 880 },
      { width: 1000, height: 900 },
      "desktop",
      { allowPlayArea: true },
    ),
    { x: 880, y: 748 },
  );
});

test("stored card positions are reclamped after a viewport shrink", () => {
  assert.deepEqual(
    clampStoredPositions(
      {
        about: { x: 900, y: 700 },
        joker: { x: 100, y: 100 },
      },
      { width: 360, height: 720 },
      "mobile",
    ),
    {
      about: { x: 288, y: 628 },
      joker: { x: 100, y: 498.4 },
    },
  );
});
