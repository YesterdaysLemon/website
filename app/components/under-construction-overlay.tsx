import { useEffect, useRef, type CSSProperties } from "react";

import type { RouteDesign } from "~/lib/route-design";

const underConstructionAssets = [
  {
    angle: 34,
    asset: "verycoolskullwithhardhatandshovelslikeajollyroger.gif",
    baseSpeed: 104,
    rotation: -8,
    speedJitter: 0.24,
    startX: 0.08,
    startY: 0.18,
  },
  {
    angle: 137,
    asset: "undrkunstuksonwithhammer.gif",
    baseSpeed: 94,
    rotation: 9,
    speedJitter: 0.28,
    startX: 0.73,
    startY: 0.14,
  },
  {
    angle: -39,
    asset: "skullpoppingoutofholewithconstructiondebris.gif",
    baseSpeed: 86,
    rotation: 7,
    speedJitter: 0.2,
    startX: 0.12,
    startY: 0.72,
  },
  {
    angle: -147,
    asset: "manusingjackhammerwithdifficulty.gif",
    baseSpeed: 112,
    rotation: -6,
    speedJitter: 0.22,
    startX: 0.78,
    startY: 0.68,
  },
  {
    angle: 70,
    asset: "anthropromorphisedhammerhittinganthronail.gif",
    baseSpeed: 78,
    rotation: 3,
    speedJitter: 0.32,
    startX: 0.45,
    startY: 0.09,
  },
] as const;

type UnderConstructionOverlayProps = {
  route: RouteDesign;
};

type SpriteBody = {
  element: HTMLImageElement;
  height: number;
  radius: number;
  rotation: number;
  velocityX: number;
  velocityY: number;
  width: number;
  x: number;
  y: number;
};

type LegacyMediaQueryList = MediaQueryList & {
  addListener?: (listener: () => void) => void;
  removeListener?: (listener: () => void) => void;
};

export function shouldShowUnderConstructionOverlay(route: RouteDesign) {
  return Boolean(route.underConstruction && import.meta.env.PROD);
}

export function UnderConstructionOverlay({
  route,
}: UnderConstructionOverlayProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const spriteRefs = useRef<Array<HTMLImageElement | null>>([]);

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) {
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
    let bodies: SpriteBody[] = [];
    let previousTime = performance.now();

    const renderBody = (body: SpriteBody) => {
      body.element.style.transform = `translate3d(${body.x - body.width / 2}px, ${
        body.y - body.height / 2
      }px, 0) rotate(${body.rotation}deg)`;
    };

    const keepInsideStage = (
      body: SpriteBody,
      width: number,
      height: number,
    ) => {
      if (body.x - body.radius < 0) {
        body.x = body.radius;
        body.velocityX = Math.abs(body.velocityX);
      } else if (body.x + body.radius > width) {
        body.x = width - body.radius;
        body.velocityX = -Math.abs(body.velocityX);
      }

      if (body.y - body.radius < 0) {
        body.y = body.radius;
        body.velocityY = Math.abs(body.velocityY);
      } else if (body.y + body.radius > height) {
        body.y = height - body.radius;
        body.velocityY = -Math.abs(body.velocityY);
      }
    };

    const resolveSpriteCollisions = () => {
      for (let index = 0; index < bodies.length; index += 1) {
        for (
          let nextIndex = index + 1;
          nextIndex < bodies.length;
          nextIndex += 1
        ) {
          const first = bodies[index];
          const second = bodies[nextIndex];
          const deltaX = second.x - first.x;
          const deltaY = second.y - first.y;
          const minDistance = first.radius + second.radius;
          const distanceSquared = deltaX * deltaX + deltaY * deltaY;

          if (distanceSquared >= minDistance * minDistance) {
            continue;
          }

          const distance = Math.sqrt(distanceSquared) || 1;
          const normalX = deltaX / distance;
          const normalY = deltaY / distance;
          const overlap = minDistance - distance;

          first.x -= normalX * overlap * 0.5;
          first.y -= normalY * overlap * 0.5;
          second.x += normalX * overlap * 0.5;
          second.y += normalY * overlap * 0.5;

          const relativeVelocityX = second.velocityX - first.velocityX;
          const relativeVelocityY = second.velocityY - first.velocityY;
          const velocityAlongNormal =
            relativeVelocityX * normalX + relativeVelocityY * normalY;

          if (velocityAlongNormal >= 0) {
            continue;
          }

          const impulse = -velocityAlongNormal;
          first.velocityX -= impulse * normalX;
          first.velocityY -= impulse * normalY;
          second.velocityX += impulse * normalX;
          second.velocityY += impulse * normalY;
        }
      }
    };

    const buildBodies = () => {
      const stageRect = stage.getBoundingClientRect();

      if (!stageRect.width || !stageRect.height) {
        return [];
      }

      const speedScale = Math.min(
        1.25,
        Math.max(0.76, Math.min(stageRect.width, stageRect.height) / 720),
      );

      return underConstructionAssets.flatMap((sprite, index) => {
        const element = spriteRefs.current[index];

        if (!element) {
          return [];
        }

        const spriteRect = element.getBoundingClientRect();
        const width = spriteRect.width || Math.min(stageRect.width * 0.22, 136);
        const height = spriteRect.height || width;
        const radius = Math.hypot(width, height) * 0.5;
        const angle = (sprite.angle * Math.PI) / 180;
        const speed =
          sprite.baseSpeed *
          speedScale *
          (1 + (Math.random() * 2 - 1) * sprite.speedJitter);
        const body = {
          element,
          height,
          radius,
          rotation: sprite.rotation,
          velocityX: Math.cos(angle) * speed,
          velocityY: Math.sin(angle) * speed,
          width,
          x: stageRect.width * sprite.startX + width / 2,
          y: stageRect.height * sprite.startY + height / 2,
        };

        keepInsideStage(body, stageRect.width, stageRect.height);
        renderBody(body);

        return [body];
      });
    };

    const start = () => {
      window.cancelAnimationFrame(animationFrame);
      bodies = buildBodies();

      if (motionPreference.matches || bodies.length === 0) {
        return;
      }

      previousTime = performance.now();

      const tick = (time: number) => {
        const stageRect = stage.getBoundingClientRect();
        const deltaTime = Math.min((time - previousTime) / 1000, 0.032);
        previousTime = time;

        bodies.forEach((body) => {
          body.x += body.velocityX * deltaTime;
          body.y += body.velocityY * deltaTime;
          keepInsideStage(body, stageRect.width, stageRect.height);
        });

        resolveSpriteCollisions();

        bodies.forEach((body) => {
          keepInsideStage(body, stageRect.width, stageRect.height);
          renderBody(body);
        });

        animationFrame = window.requestAnimationFrame(tick);
      };

      animationFrame = window.requestAnimationFrame(tick);
    };

    const resizeObserver =
      "ResizeObserver" in window ? new ResizeObserver(start) : null;
    const imageCleanups = spriteRefs.current.flatMap((element) => {
      if (!element || element.complete) {
        return [];
      }

      element.addEventListener("load", start);

      return [
        () => {
          element.removeEventListener("load", start);
        },
      ];
    });

    if (resizeObserver) {
      resizeObserver.observe(stage);
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

      imageCleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <aside
      aria-label={`${route.label} is under construction`}
      className="under-construction-overlay"
      style={{ "--route-accent": route.accent } as CSSProperties}
    >
      <div
        className="under-construction-stage"
        aria-hidden="true"
        ref={stageRef}
      >
        {underConstructionAssets.map((sprite, index) => (
          <img
            alt=""
            className="under-construction-sprite"
            key={sprite.asset}
            ref={(element) => {
              spriteRefs.current[index] = element;
            }}
            src={`/under-construction/${sprite.asset}`}
          />
        ))}
      </div>

      <div className="under-construction-copy">
        <p className="under-construction-kicker">
          {route.rank}
          {route.suit} / Under Construction
        </p>
        <h2>gimmie a sec :3</h2>
      </div>
    </aside>
  );
}
