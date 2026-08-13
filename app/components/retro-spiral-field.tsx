import { useEffect, useRef } from "react";

import {
  keepBodyInsideBounds,
  stepBoundedBodies,
  type BoundedBody,
  type PhysicsBounds,
} from "~/lib/bounded-body-physics";

const ringCount = 8;
const spiralPositions = ["one", "two", "three"] as const;
const dotPositions = ["one", "two", "three"] as const;

const roamingBodyConfigs = [
  {
    angle: 27,
    boundaryRadius: 76,
    collisionRadius: 116,
    speed: 26,
    startX: 0.84,
    startY: 0.16,
    visualRadiusScale: 0.68,
  },
  {
    angle: 151,
    boundaryRadius: 70,
    collisionRadius: 102,
    speed: 22,
    startX: 0.13,
    startY: 0.58,
    visualRadiusScale: 0.68,
  },
  {
    angle: -56,
    boundaryRadius: 60,
    collisionRadius: 86,
    speed: 28,
    startX: 0.76,
    startY: 0.82,
    visualRadiusScale: 0.68,
  },
  {
    angle: -36,
    boundaryRadius: 10,
    collisionRadius: 12,
    speed: 44,
    startX: 0.12,
    startY: 0.23,
    visualRadiusScale: 1,
  },
  {
    angle: 212,
    boundaryRadius: 10,
    collisionRadius: 12,
    speed: 39,
    startX: 0.84,
    startY: 0.66,
    visualRadiusScale: 1,
  },
  {
    angle: 128,
    boundaryRadius: 10,
    collisionRadius: 12,
    speed: 47,
    startX: 0.61,
    startY: 0.89,
    visualRadiusScale: 1,
  },
] as const;

type RoamingBody = BoundedBody & {
  active: boolean;
  element: HTMLElement;
};

type LegacyMediaQueryList = MediaQueryList & {
  addListener?: (listener: () => void) => void;
  removeListener?: (listener: () => void) => void;
};

export function RetroSpiralField() {
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const bodyRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const field = fieldRef.current;

    if (!field) {
      return;
    }

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ) as LegacyMediaQueryList;
    const legacyMotionPreference = motionPreference as {
      addListener?: (listener: () => void) => void;
      removeListener?: (listener: () => void) => void;
    };
    let animationFrame = 0;
    let bodies: RoamingBody[] = [];
    let bounds: PhysicsBounds = { width: 0, height: 0 };
    let previousTime = performance.now();

    const renderBody = (body: RoamingBody) => {
      body.element.style.setProperty("--retro-x", `${body.x.toFixed(2)}px`);
      body.element.style.setProperty("--retro-y", `${body.y.toFixed(2)}px`);
    };

    const readBounds = (): PhysicsBounds => {
      const rect = field.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    };

    const readCollisionRadius = (
      config: (typeof roamingBodyConfigs)[number],
      element: HTMLElement,
    ) =>
      Math.max(
        config.collisionRadius,
        (element.getBoundingClientRect().width / 2) * config.visualRadiusScale,
      );

    const buildBodies = (nextBounds: PhysicsBounds) => {
      const speedScale = Math.min(
        1.15,
        Math.max(0.72, Math.min(nextBounds.width, nextBounds.height) / 900),
      );

      return roamingBodyConfigs.flatMap((config, index) => {
        const element = bodyRefs.current[index];

        if (!element) {
          return [];
        }

        const angle = (config.angle * Math.PI) / 180;
        const radius = readCollisionRadius(config, element);
        const body: RoamingBody = {
          active: getComputedStyle(element).display !== "none",
          boundaryRadiusX: config.boundaryRadius,
          boundaryRadiusY: config.boundaryRadius,
          element,
          inverseMass: 1 / (radius * radius),
          radius,
          velocityX: Math.cos(angle) * config.speed * speedScale,
          velocityY: Math.sin(angle) * config.speed * speedScale,
          x: nextBounds.width * config.startX,
          y: nextBounds.height * config.startY,
        };

        keepBodyInsideBounds(body, nextBounds);
        renderBody(body);
        return [body];
      });
    };

    const resizeBodies = (nextBounds: PhysicsBounds) => {
      if (!nextBounds.width || !nextBounds.height) {
        return false;
      }

      if (bodies.length === 0 || !bounds.width || !bounds.height) {
        bodies = buildBodies(nextBounds);
      } else {
        const scaleX = nextBounds.width / bounds.width;
        const scaleY = nextBounds.height / bounds.height;

        bodies.forEach((body, index) => {
          const radius = readCollisionRadius(
            roamingBodyConfigs[index],
            body.element,
          );

          body.active = getComputedStyle(body.element).display !== "none";
          body.inverseMass = 1 / (radius * radius);
          body.radius = radius;
          body.x *= scaleX;
          body.y *= scaleY;
          keepBodyInsideBounds(body, nextBounds);
          renderBody(body);
        });
      }

      bounds = nextBounds;
      return bodies.length > 0;
    };

    const tick = (time: number) => {
      const deltaTime = (time - previousTime) / 1000;
      previousTime = time;
      const fieldScale = Math.min(bounds.width, bounds.height);
      const separationPadding = Math.min(52, Math.max(24, fieldScale * 0.065));

      stepBoundedBodies(
        bodies.filter((body) => body.active),
        bounds,
        deltaTime,
        {
          collisionPasses: 4,
          fieldCenter: { x: bounds.width / 2, y: bounds.height / 2 },
          fieldDeadZoneRadius: fieldScale * 0.2,
          fieldStrength: 0.003,
          linearDrag: 0.006,
          repulsionRange: 2.1,
          repulsionStrength: 210,
          restitution: 0.992,
          separationPadding,
        },
      );
      bodies.forEach(renderBody);
      animationFrame = window.requestAnimationFrame(tick);
    };

    const start = () => {
      window.cancelAnimationFrame(animationFrame);

      if (!resizeBodies(readBounds()) || motionPreference.matches) {
        return;
      }

      previousTime = performance.now();
      animationFrame = window.requestAnimationFrame(tick);
    };

    const resizeObserver =
      "ResizeObserver" in window ? new ResizeObserver(start) : null;

    if (resizeObserver) {
      resizeObserver.observe(field);
    } else {
      window.addEventListener("resize", start);
    }

    if ("addEventListener" in motionPreference) {
      motionPreference.addEventListener("change", start);
    } else {
      legacyMotionPreference.addListener?.(start);
    }

    start();

    return () => {
      window.cancelAnimationFrame(animationFrame);

      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", start);
      }

      if ("removeEventListener" in motionPreference) {
        motionPreference.removeEventListener("change", start);
      } else {
        legacyMotionPreference.removeListener?.(start);
      }
    };
  }, []);

  return (
    <div className="retro-spiral-field" aria-hidden="true" ref={fieldRef}>
      {spiralPositions.map((position, index) => (
        <div
          className={`retro-spiral retro-spiral-${position}`}
          key={position}
          ref={(element) => {
            bodyRefs.current[index] = element;
          }}
        >
          <div className="retro-spiral-rings">
            {Array.from({ length: ringCount }, (_, ringIndex) => (
              <span key={ringIndex} />
            ))}
          </div>
        </div>
      ))}
      {dotPositions.map((position, index) => (
        <span
          className={`retro-drift-dot retro-drift-dot-${position}`}
          key={position}
          ref={(element) => {
            bodyRefs.current[spiralPositions.length + index] = element;
          }}
        />
      ))}
    </div>
  );
}
