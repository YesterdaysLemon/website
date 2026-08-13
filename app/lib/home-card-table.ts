export type CardId = "about" | "showcase" | "projects" | "resume" | "joker";
export type Breakpoint = "mobile" | "tablet" | "desktop";

export type ActionCard = {
  id: CardId;
  title: string;
  rank: string;
  suit: string;
  to: string;
  summary: string;
  accent: string;
};

export type SpreadPosition = {
  x: number;
  y: number;
  rotate: number;
};

export type PixelPosition = {
  x: number;
  y: number;
};

export type CardOrigin = {
  x: number;
  y: number;
};

export type CardRotations = Record<CardId, number>;

export type DragState = {
  id: CardId;
  pointerId: number;
  offsetX: number;
  offsetY: number;
  hasMoved: boolean;
  lastX: number;
  lastY: number;
  lastTime: number;
  velocityX: number;
  velocityY: number;
  accelerationX: number;
  accelerationY: number;
  startRotation: number;
  smoothedRotation: number;
  originX: number;
  originY: number;
  cardWidth: number;
  cardHeight: number;
  angularVelocity: number;
};

export const actionCards: ActionCard[] = [
  {
    id: "about",
    title: "About",
    rank: "A",
    suit: "\u2666",
    to: "/about",
    summary: "The crooked route here and the rabbit holes that stuck.",
    accent: "var(--diamond)",
  },
  {
    id: "showcase",
    title: "Showcase",
    rank: "S",
    suit: "\u2665",
    to: "/showcase",
    summary:
      "Live experiments, tiny websites, and the permanent construction crew.",
    accent: "var(--heart)",
  },
  {
    id: "joker",
    title: "Wildcard",
    rank: "★",
    suit: "✦",
    to: "/showcase#micro-experiments",
    summary: "A random rabbit hole from somewhere in the workbench.",
    accent: "#8a5a12",
  },
  {
    id: "projects",
    title: "Projects",
    rank: "P",
    suit: "\u2660",
    to: "/projects",
    summary: "The useful details, honest limits, and receipts behind the work.",
    accent: "var(--spade)",
  },
  {
    id: "resume",
    title: "Resume",
    rank: "R",
    suit: "\u2663",
    to: "/resume",
    summary: "Experience, skills, and the reasonably tidy version of events.",
    accent: "var(--club)",
  },
];

export const spreadPositions: Record<
  Breakpoint,
  Record<CardId, SpreadPosition>
> = {
  mobile: {
    about: { x: 13, y: 78, rotate: -15 },
    showcase: { x: 32, y: 74, rotate: -7 },
    joker: { x: 50, y: 72, rotate: 0 },
    projects: { x: 68, y: 74, rotate: 7 },
    resume: { x: 87, y: 78, rotate: 15 },
  },
  tablet: {
    about: { x: 22, y: 62, rotate: -17 },
    showcase: { x: 36, y: 56, rotate: -8 },
    joker: { x: 50, y: 53, rotate: 0 },
    projects: { x: 64, y: 56, rotate: 8 },
    resume: { x: 78, y: 62, rotate: 17 },
  },
  desktop: {
    about: { x: 25, y: 61, rotate: -18 },
    showcase: { x: 38, y: 55, rotate: -8 },
    joker: { x: 50, y: 52, rotate: 0 },
    projects: { x: 62, y: 55, rotate: 8 },
    resume: { x: 75, y: 61, rotate: 18 },
  },
};

export const jokerDestinations = [
  "/about-blackjack-lab.html",
  "/showcase#micro-experiments",
  "/projects?project=wurmkickflip",
  "/projects?project=celegans-sim",
  "/projects?project=forgeward",
  "/projects?project=open-mathematics-lab",
  "/projects?project=job-application-batch-builder",
] as const;

export const initialStackOrder = actionCards.map((card) => card.id);

export function getBreakpoint(width: number): Breakpoint {
  if (width >= 1024) {
    return "desktop";
  }

  if (width >= 640) {
    return "tablet";
  }

  return "mobile";
}

export function isMailLink(to: string): boolean {
  return to.startsWith("mailto:");
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function clampPositionToTable(
  position: PixelPosition,
  table: { width: number; height: number },
  breakpoint: Breakpoint,
  options: { allowPlayArea?: boolean } = {},
): PixelPosition {
  const horizontalGutter =
    breakpoint === "mobile" ? 72 : breakpoint === "tablet" ? 100 : 120;
  const verticalGutter =
    breakpoint === "mobile" ? 92 : breakpoint === "tablet" ? 126 : 152;
  const minimumY = options.allowPlayArea
    ? verticalGutter
    : breakpoint === "mobile"
      ? table.height * (2 / 3) + verticalGutter * 0.2
      : table.height / 3 + verticalGutter * 0.42;

  return {
    x: clamp(
      position.x,
      horizontalGutter,
      Math.max(horizontalGutter, table.width - horizontalGutter),
    ),
    y: clamp(
      position.y,
      minimumY,
      Math.max(minimumY, table.height - verticalGutter),
    ),
  };
}

export function clampStoredPositions(
  positions: Partial<Record<CardId, PixelPosition>>,
  table: { width: number; height: number },
  breakpoint: Breakpoint,
): Partial<Record<CardId, PixelPosition>> {
  return Object.fromEntries(
    Object.entries(positions).map(([id, position]) => [
      id,
      clampPositionToTable(position, table, breakpoint),
    ]),
  );
}

export function createBaseRotations(breakpoint: Breakpoint): CardRotations {
  return actionCards.reduce<CardRotations>((rotations, card) => {
    rotations[card.id] = spreadPositions[breakpoint][card.id].rotate;
    return rotations;
  }, {} as CardRotations);
}

function randomSignedAngle(max: number): number {
  const angle = Math.random() * max * 2 - max;

  if (Math.abs(angle) >= 2.5) {
    return angle;
  }

  return angle < 0 ? angle - 3 : angle + 3;
}

export function createRandomRotations(breakpoint: Breakpoint): CardRotations {
  const jitter = breakpoint === "mobile" ? 5 : 8;

  return actionCards.reduce<CardRotations>((rotations, card) => {
    const baseRotation = spreadPositions[breakpoint][card.id].rotate;
    rotations[card.id] = Number(
      (baseRotation + randomSignedAngle(jitter)).toFixed(1),
    );
    return rotations;
  }, {} as CardRotations);
}

export function createDragRotation(
  drag: DragState,
  breakpoint: Breakpoint,
): number {
  const maxTilt = breakpoint === "mobile" ? 14 : 20;
  const leverX = (drag.originX - drag.cardWidth / 2) / (drag.cardWidth / 2);
  const leverY = (drag.originY - drag.cardHeight / 2) / (drag.cardHeight / 2);
  const torque = leverX * drag.velocityY - leverY * drag.velocityX;
  const velocityTilt = drag.velocityX * 6 - drag.velocityY * 1.5;
  const accelerationTilt = drag.accelerationX * 36;
  const pickupTorque = torque * 42;

  return Number(
    clamp(
      velocityTilt + accelerationTilt + pickupTorque,
      -maxTilt,
      maxTilt,
    ).toFixed(1),
  );
}

export function createMomentumDropRotation(
  drag: DragState,
  breakpoint: Breakpoint,
): number {
  const maxRotation = breakpoint === "mobile" ? 15 : 24;
  const speed = Math.hypot(drag.velocityX, drag.velocityY);
  const direction = Math.atan2(drag.velocityY, drag.velocityX || 0.001);
  const directionDegrees = (direction * 180) / Math.PI;
  const speedWeight = clamp(speed / 1.45, 0, 1);
  const motionSpin =
    Math.sin(direction) * maxRotation * 0.48 * speedWeight +
    Math.cos(direction) * maxRotation * 0.2 * speedWeight;
  const accelerationSpin = clamp(
    (drag.accelerationX - drag.accelerationY * 0.35) * 180,
    -maxRotation * 0.34,
    maxRotation * 0.34,
  );
  const angularSpin = clamp(
    drag.angularVelocity * 44,
    -maxRotation * 0.62,
    maxRotation * 0.62,
  );
  const carriedSpin = clamp(drag.startRotation * 0.34, -5, 5);
  const directionBias =
    clamp(directionDegrees / 180, -1, 1) * 2.2 * speedWeight;

  return Number(
    clamp(
      carriedSpin + motionSpin + accelerationSpin + angularSpin + directionBias,
      -maxRotation,
      maxRotation,
    ).toFixed(1),
  );
}
