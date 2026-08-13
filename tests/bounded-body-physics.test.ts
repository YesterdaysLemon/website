import assert from "node:assert/strict";
import test from "node:test";

import {
  applyCentralField,
  applyPairwiseRepulsion,
  keepBodyInsideBounds,
  resolveCircularBodyCollisions,
  stepBoundedBodies,
  type BoundedBody,
} from "../app/lib/bounded-body-physics.ts";

function body(overrides: Partial<BoundedBody> = {}): BoundedBody {
  return {
    radius: 10,
    velocityX: 0,
    velocityY: 0,
    x: 50,
    y: 50,
    ...overrides,
  };
}

test("bounded bodies bounce off each wall without escaping", () => {
  const moving = body({ velocityX: -30, velocityY: 40, x: 4, y: 98 });

  keepBodyInsideBounds(moving, { width: 100, height: 100 });

  assert.deepEqual(moving, {
    radius: 10,
    velocityX: 30,
    velocityY: -40,
    x: 10,
    y: 90,
  });
});

test("circle collisions separate overlaps and exchange equal-mass velocity", () => {
  const first = body({ velocityX: 12, x: 40 });
  const second = body({ velocityX: -12, x: 55 });

  resolveCircularBodyCollisions([first, second]);

  assert.equal(first.x, 37.5);
  assert.equal(second.x, 57.5);
  assert.equal(first.velocityX, -12);
  assert.equal(second.velocityX, 12);
});

test("lighter bodies absorb more of an unequal-mass collision", () => {
  const heavy = body({ inverseMass: 0.01, velocityX: 3, x: 40 });
  const light = body({ inverseMass: 1, velocityX: -20, x: 55 });

  resolveCircularBodyCollisions([heavy, light]);

  assert.ok(heavy.velocityX < 3);
  assert.ok(heavy.velocityX > 2);
  assert.ok(light.velocityX > 20);
});

test("collision clearance keeps body hitboxes from touching", () => {
  const first = body({ x: 40 });
  const second = body({ x: 55 });

  resolveCircularBodyCollisions([first, second], 1, 8);

  assert.equal(second.x - first.x, 28);
});

test("physics steps clamp long frames before integrating", () => {
  const moving = body({ velocityX: 100, x: 20 });

  stepBoundedBodies([moving], { width: 500, height: 100 }, 2);

  assert.equal(moving.x, 23.2);
});

test("nearby bodies repel before they collide", () => {
  const first = body({ x: 35 });
  const second = body({ x: 65 });

  applyPairwiseRepulsion([first, second], 1, 40, 2);

  assert.ok(first.velocityX < 0);
  assert.ok(second.velocityX > 0);
  assert.equal(first.velocityX, -second.velocityX);
});

test("the central field curves roaming bodies back inward", () => {
  const roaming = body({ velocityY: 4, x: 90, y: 60 });

  applyCentralField([roaming], { x: 50, y: 50 }, 0.5, 0.2);

  assert.equal(roaming.velocityX, -4);
  assert.equal(roaming.velocityY, 3);
});

test("the central field leaves a broad roaming basin around its center", () => {
  const roaming = body({ velocityX: 5, x: 60, y: 50 });

  applyCentralField([roaming], { x: 50, y: 50 }, 1, 1, 20);

  assert.equal(roaming.velocityX, 5);
  assert.equal(roaming.velocityY, 0);
});

test("stepping preserves personal space while the field pulls inward", () => {
  const first = body({ radius: 20, x: 70, y: 100 });
  const second = body({ radius: 20, x: 130, y: 100 });
  const minimumDistance = first.radius + second.radius + 24;

  for (let frame = 0; frame < 360; frame += 1) {
    stepBoundedBodies([first, second], { width: 200, height: 200 }, 1 / 60, {
      collisionPasses: 4,
      fieldCenter: { x: 100, y: 100 },
      fieldDeadZoneRadius: 15,
      fieldStrength: 0.02,
      linearDrag: 0.006,
      repulsionRange: 2.1,
      repulsionStrength: 210,
      separationPadding: 24,
    });

    assert.ok(Math.hypot(second.x - first.x, second.y - first.y) >= 63.999);
  }
});
