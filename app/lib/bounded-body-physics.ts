export type BoundedBody = {
  boundaryRadiusX?: number;
  boundaryRadiusY?: number;
  inverseMass?: number;
  radius: number;
  velocityX: number;
  velocityY: number;
  x: number;
  y: number;
};

export type PhysicsBounds = {
  height: number;
  width: number;
};

export type PhysicsPoint = {
  x: number;
  y: number;
};

export type PhysicsStepOptions = {
  collisionPasses?: number;
  fieldCenter?: PhysicsPoint;
  fieldDeadZoneRadius?: number;
  fieldStrength?: number;
  linearDrag?: number;
  maxDeltaSeconds?: number;
  repulsionRange?: number;
  repulsionStrength?: number;
  restitution?: number;
  separationPadding?: number;
};

function getBoundaryRadius(body: BoundedBody, axis: "x" | "y", extent: number) {
  const requested =
    axis === "x"
      ? (body.boundaryRadiusX ?? body.radius)
      : (body.boundaryRadiusY ?? body.radius);

  return Math.min(Math.max(requested, 0), Math.max(extent, 0) / 2);
}

export function keepBodyInsideBounds(
  body: BoundedBody,
  bounds: PhysicsBounds,
  restitution = 1,
) {
  const width = Math.max(bounds.width, 0);
  const height = Math.max(bounds.height, 0);
  const radiusX = getBoundaryRadius(body, "x", width);
  const radiusY = getBoundaryRadius(body, "y", height);
  const minX = radiusX;
  const maxX = width - radiusX;
  const minY = radiusY;
  const maxY = height - radiusY;

  if (body.x < minX) {
    body.x = minX;
    body.velocityX = Math.abs(body.velocityX) * restitution;
  } else if (body.x > maxX) {
    body.x = maxX;
    body.velocityX = -Math.abs(body.velocityX) * restitution;
  }

  if (body.y < minY) {
    body.y = minY;
    body.velocityY = Math.abs(body.velocityY) * restitution;
  } else if (body.y > maxY) {
    body.y = maxY;
    body.velocityY = -Math.abs(body.velocityY) * restitution;
  }
}

export function resolveCircularBodyCollisions(
  bodies: BoundedBody[],
  restitution = 1,
  separationPadding = 0,
) {
  const clearance = Math.max(separationPadding, 0);

  for (let index = 0; index < bodies.length; index += 1) {
    for (let nextIndex = index + 1; nextIndex < bodies.length; nextIndex += 1) {
      const first = bodies[index];
      const second = bodies[nextIndex];
      const deltaX = second.x - first.x;
      const deltaY = second.y - first.y;
      const minimumDistance = first.radius + second.radius + clearance;
      const distanceSquared = deltaX * deltaX + deltaY * deltaY;

      if (
        minimumDistance <= 0 ||
        distanceSquared >= minimumDistance * minimumDistance
      ) {
        continue;
      }

      const distance = Math.sqrt(distanceSquared) || 1;
      const normalX = distanceSquared === 0 ? 1 : deltaX / distance;
      const normalY = distanceSquared === 0 ? 0 : deltaY / distance;
      const inverseMassFirst = Math.max(first.inverseMass ?? 1, 0);
      const inverseMassSecond = Math.max(second.inverseMass ?? 1, 0);
      const inverseMassTotal = inverseMassFirst + inverseMassSecond;

      if (inverseMassTotal === 0) {
        continue;
      }

      const overlap = minimumDistance - distance;
      first.x -= normalX * overlap * (inverseMassFirst / inverseMassTotal);
      first.y -= normalY * overlap * (inverseMassFirst / inverseMassTotal);
      second.x += normalX * overlap * (inverseMassSecond / inverseMassTotal);
      second.y += normalY * overlap * (inverseMassSecond / inverseMassTotal);

      const relativeVelocityX = second.velocityX - first.velocityX;
      const relativeVelocityY = second.velocityY - first.velocityY;
      const velocityAlongNormal =
        relativeVelocityX * normalX + relativeVelocityY * normalY;

      if (velocityAlongNormal >= 0) {
        continue;
      }

      const impulse =
        (-(1 + restitution) * velocityAlongNormal) / inverseMassTotal;
      first.velocityX -= impulse * inverseMassFirst * normalX;
      first.velocityY -= impulse * inverseMassFirst * normalY;
      second.velocityX += impulse * inverseMassSecond * normalX;
      second.velocityY += impulse * inverseMassSecond * normalY;
    }
  }
}

export function applyCentralField(
  bodies: BoundedBody[],
  center: PhysicsPoint,
  deltaSeconds: number,
  strength: number,
  deadZoneRadius = 0,
) {
  if (strength <= 0 || deltaSeconds <= 0) {
    return;
  }

  const deadZone = Math.max(deadZoneRadius, 0);

  bodies.forEach((body) => {
    const deltaX = center.x - body.x;
    const deltaY = center.y - body.y;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance <= deadZone) {
      return;
    }

    const fieldScale = deadZone > 0 ? (distance - deadZone) / distance : 1;
    body.velocityX += deltaX * fieldScale * strength * deltaSeconds;
    body.velocityY += deltaY * fieldScale * strength * deltaSeconds;
  });
}

export function applyPairwiseRepulsion(
  bodies: BoundedBody[],
  deltaSeconds: number,
  strength: number,
  rangeMultiplier = 1.8,
  separationPadding = 0,
) {
  if (strength <= 0 || deltaSeconds <= 0 || rangeMultiplier <= 1) {
    return;
  }

  for (let index = 0; index < bodies.length; index += 1) {
    for (let nextIndex = index + 1; nextIndex < bodies.length; nextIndex += 1) {
      const first = bodies[index];
      const second = bodies[nextIndex];
      const deltaX = second.x - first.x;
      const deltaY = second.y - first.y;
      const distanceSquared = deltaX * deltaX + deltaY * deltaY;
      const distance = Math.sqrt(distanceSquared) || 1;
      const personalDistance =
        first.radius + second.radius + Math.max(separationPadding, 0);
      const influenceDistance = personalDistance * rangeMultiplier;

      if (personalDistance <= 0 || distance >= influenceDistance) {
        continue;
      }

      const normalX = distanceSquared === 0 ? 1 : deltaX / distance;
      const normalY = distanceSquared === 0 ? 0 : deltaY / distance;
      const inverseMassFirst = Math.max(first.inverseMass ?? 1, 0);
      const inverseMassSecond = Math.max(second.inverseMass ?? 1, 0);
      const inverseMassTotal = inverseMassFirst + inverseMassSecond;

      if (inverseMassTotal === 0) {
        continue;
      }

      const falloff = 1 - distance / influenceDistance;
      const acceleration = strength * falloff * falloff;
      const firstResponse = (inverseMassFirst / inverseMassTotal) * 2;
      const secondResponse = (inverseMassSecond / inverseMassTotal) * 2;

      first.velocityX -= normalX * acceleration * firstResponse * deltaSeconds;
      first.velocityY -= normalY * acceleration * firstResponse * deltaSeconds;
      second.velocityX +=
        normalX * acceleration * secondResponse * deltaSeconds;
      second.velocityY +=
        normalY * acceleration * secondResponse * deltaSeconds;
    }
  }
}

export function stepBoundedBodies(
  bodies: BoundedBody[],
  bounds: PhysicsBounds,
  deltaSeconds: number,
  {
    collisionPasses = 1,
    fieldCenter,
    fieldDeadZoneRadius = 0,
    fieldStrength = 0,
    linearDrag = 0,
    maxDeltaSeconds = 0.032,
    repulsionRange = 1.8,
    repulsionStrength = 0,
    restitution = 1,
    separationPadding = 0,
  }: PhysicsStepOptions = {},
) {
  const deltaTime = Math.min(
    Math.max(Number.isFinite(deltaSeconds) ? deltaSeconds : 0, 0),
    Math.max(maxDeltaSeconds, 0),
  );

  applyPairwiseRepulsion(
    bodies,
    deltaTime,
    repulsionStrength,
    repulsionRange,
    separationPadding,
  );

  if (fieldCenter) {
    applyCentralField(
      bodies,
      fieldCenter,
      deltaTime,
      fieldStrength,
      fieldDeadZoneRadius,
    );
  }

  const drag = Math.exp(-Math.max(linearDrag, 0) * deltaTime);

  bodies.forEach((body) => {
    body.velocityX *= drag;
    body.velocityY *= drag;
    body.x += body.velocityX * deltaTime;
    body.y += body.velocityY * deltaTime;
    keepBodyInsideBounds(body, bounds, restitution);
  });

  const collisionIterations = Math.min(
    8,
    Math.max(
      1,
      Math.floor(Number.isFinite(collisionPasses) ? collisionPasses : 1),
    ),
  );

  for (let pass = 0; pass < collisionIterations; pass += 1) {
    resolveCircularBodyCollisions(bodies, restitution, separationPadding);
    bodies.forEach((body) => keepBodyInsideBounds(body, bounds, restitution));
  }
}
