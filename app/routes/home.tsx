import type { CSSProperties, MouseEvent, PointerEvent } from "react";
import type { Route } from "./+types/home";

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";

type CardId = "projects" | "blog" | "resume" | "about" | "contact";
type Breakpoint = "mobile" | "tablet" | "desktop";

type ActionCard = {
  id: CardId;
  title: string;
  rank: string;
  suit: string;
  to: string;
  summary: string;
  accent: "ink" | "red";
};

type SpreadPosition = {
  x: number;
  y: number;
  rotate: number;
};

type PixelPosition = {
  x: number;
  y: number;
};

type CardOrigin = {
  x: number;
  y: number;
};

type CardRotations = Record<CardId, number>;

type DragState = {
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

const actionCards: ActionCard[] = [
  {
    id: "projects",
    title: "Projects",
    rank: "P",
    suit: "♠",
    to: "/projects",
    summary: "Selected work, systems, and builds.",
    accent: "ink",
  },
  {
    id: "blog",
    title: "Blog",
    rank: "B",
    suit: "♥",
    to: "/blog",
    summary: "Notes on software and delivery.",
    accent: "red",
  },
  {
    id: "resume",
    title: "Resume",
    rank: "R",
    suit: "♣",
    to: "/resume",
    summary: "Experience, education, and PDF.",
    accent: "ink",
  },
  {
    id: "about",
    title: "About",
    rank: "A",
    suit: "♦",
    to: "/about",
    summary: "Profile, focus, and context.",
    accent: "red",
  },
  {
    id: "contact",
    title: "Contact",
    rank: "C",
    suit: "♠",
    to: "mailto:mail@alirezaafshan.com",
    summary: "Email and GitHub.",
    accent: "ink",
  },
];

const spreadPositions: Record<Breakpoint, Record<CardId, SpreadPosition>> = {
  mobile: {
    projects: { x: 28, y: 74, rotate: -10 },
    blog: { x: 72, y: 75, rotate: 8 },
    resume: { x: 27, y: 88, rotate: 6 },
    about: { x: 73, y: 89, rotate: -7 },
    contact: { x: 50, y: 94, rotate: 3 },
  },
  tablet: {
    projects: { x: 20, y: 61, rotate: -13 },
    blog: { x: 38, y: 47, rotate: -6 },
    resume: { x: 59, y: 50, rotate: 7 },
    about: { x: 78, y: 64, rotate: 13 },
    contact: { x: 49, y: 81, rotate: -4 },
  },
  desktop: {
    projects: { x: 18, y: 61, rotate: -15 },
    blog: { x: 36, y: 47, rotate: -7 },
    resume: { x: 57, y: 51, rotate: 6 },
    about: { x: 76, y: 63, rotate: 14 },
    contact: { x: 49, y: 82, rotate: -4 },
  },
};

const initialStackOrder = actionCards.map((card) => card.id);

export function meta({}: Route.MetaArgs) {
  return [
    { title: "alireza afshan" },
    {
      name: "description",
      content:
        "Software and systems engineer working across application development, delivery, and information systems.",
    },
  ];
}

function getBreakpoint(width: number): Breakpoint {
  if (width >= 1024) {
    return "desktop";
  }

  if (width >= 640) {
    return "tablet";
  }

  return "mobile";
}

function isMailLink(to: string) {
  return to.startsWith("mailto:");
}

function createBaseRotations(breakpoint: Breakpoint): CardRotations {
  return actionCards.reduce<CardRotations>((rotations, card) => {
    rotations[card.id] = spreadPositions[breakpoint][card.id].rotate;
    return rotations;
  }, {} as CardRotations);
}

function randomSignedAngle(max: number) {
  const angle = Math.random() * max * 2 - max;

  if (Math.abs(angle) >= 2.5) {
    return angle;
  }

  return angle < 0 ? angle - 3 : angle + 3;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function createRandomRotations(breakpoint: Breakpoint): CardRotations {
  const jitter = breakpoint === "mobile" ? 5 : 8;

  return actionCards.reduce<CardRotations>((rotations, card) => {
    const baseRotation = spreadPositions[breakpoint][card.id].rotate;
    rotations[card.id] = Number(
      (baseRotation + randomSignedAngle(jitter)).toFixed(1),
    );
    return rotations;
  }, {} as CardRotations);
}

function createDragRotation(drag: DragState, breakpoint: Breakpoint) {
  const maxTilt = breakpoint === "mobile" ? 14 : 20;
  const leverX = (drag.originX - drag.cardWidth / 2) / (drag.cardWidth / 2);
  const leverY = (drag.originY - drag.cardHeight / 2) / (drag.cardHeight / 2);
  const torque = leverX * drag.velocityY - leverY * drag.velocityX;
  const velocityTilt = drag.velocityX * 6 - drag.velocityY * 1.5;
  const accelerationTilt = drag.accelerationX * 36;
  const pickupTorque = torque * 42;

  return Number(
    clamp(velocityTilt + accelerationTilt + pickupTorque, -maxTilt, maxTilt).toFixed(1),
  );
}

function createMomentumDropRotation(drag: DragState, breakpoint: Breakpoint) {
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
  const angularSpin = clamp(drag.angularVelocity * 44, -maxRotation * 0.62, maxRotation * 0.62);
  const carriedSpin = clamp(drag.startRotation * 0.34, -5, 5);
  const directionBias = clamp(directionDegrees / 180, -1, 1) * 2.2 * speedWeight;

  return Number(
    clamp(
      carriedSpin + motionSpin + accelerationSpin + angularSpin + directionBias,
      -maxRotation,
      maxRotation,
    ).toFixed(1),
  );
}

export default function Home() {
  const navigate = useNavigate();
  const tableRef = useRef<HTMLDivElement | null>(null);
  const playZoneRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");
  const [hasDealt, setHasDealt] = useState(false);
  const [isShuffling, setIsShuffling] = useState(true);
  const [draggingId, setDraggingId] = useState<CardId | null>(null);
  const [liftingId, setLiftingId] = useState<CardId | null>(null);
  const [playingId, setPlayingId] = useState<CardId | null>(null);
  const [cardPositions, setCardPositions] = useState<
    Partial<Record<CardId, PixelPosition>>
  >({});
  const [stackOrder, setStackOrder] = useState<CardId[]>(initialStackOrder);
  const [cardRotations, setCardRotations] = useState<CardRotations>(
    createBaseRotations("desktop"),
  );
  const [dragRotations, setDragRotations] = useState<Partial<CardRotations>>(
    {},
  );
  const [cardOrigins, setCardOrigins] = useState<
    Partial<Record<CardId, CardOrigin>>
  >({});

  const positions = useMemo(() => spreadPositions[breakpoint], [breakpoint]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function updateBreakpoint() {
      setBreakpoint(getBreakpoint(window.innerWidth));
    }

    const nextBreakpoint = getBreakpoint(window.innerWidth);
    setBreakpoint(nextBreakpoint);
    setCardRotations(createRandomRotations(nextBreakpoint));
    window.addEventListener("resize", updateBreakpoint);

    if (mediaQuery.matches) {
      setHasDealt(true);
      setIsShuffling(false);
      return () => window.removeEventListener("resize", updateBreakpoint);
    }

    const dealTimer = window.setTimeout(() => {
      setHasDealt(true);
    }, 760);
    const shuffleTimer = window.setTimeout(() => {
      setIsShuffling(false);
    }, 1120);

    return () => {
      window.removeEventListener("resize", updateBreakpoint);
      window.clearTimeout(dealTimer);
      window.clearTimeout(shuffleTimer);
    };
  }, []);

  function navigateToCard(card: ActionCard) {
    if (isMailLink(card.to)) {
      window.location.href = card.to;
      return;
    }

    navigate(card.to);
  }

  function getCardCenter(cardId: CardId) {
    const tableRect = tableRef.current?.getBoundingClientRect();
    const storedPosition = cardPositions[cardId];

    if (!tableRect) {
      return { x: 0, y: 0 };
    }

    if (storedPosition) {
      return storedPosition;
    }

    const spreadPosition = positions[cardId];
    return {
      x: (spreadPosition.x / 100) * tableRect.width,
      y: (spreadPosition.y / 100) * tableRect.height,
    };
  }

  function clampToTable(
    x: number,
    y: number,
    options?: { allowPlayArea?: boolean },
  ) {
    const tableRect = tableRef.current?.getBoundingClientRect();

    if (!tableRect) {
      return { x, y };
    }

    const gutter = breakpoint === "mobile" ? 48 : 82;
    const minimumY = options?.allowPlayArea
      ? gutter
      : breakpoint === "mobile"
        ? tableRect.height * (2 / 3) + gutter * 0.2
        : tableRect.height / 3 + gutter * 0.42;

    return {
      x: Math.min(Math.max(x, gutter), tableRect.width - gutter),
      y: Math.min(Math.max(y, minimumY), tableRect.height - gutter),
    };
  }

  function isInsidePlayZone(x: number, y: number) {
    const tableRect = tableRef.current?.getBoundingClientRect();
    const playZoneRect = playZoneRef.current?.getBoundingClientRect();

    if (!tableRect || !playZoneRect) {
      return false;
    }

    return (
      x + tableRect.left >= playZoneRect.left &&
      x + tableRect.left <= playZoneRect.right &&
      y + tableRect.top >= playZoneRect.top &&
      y + tableRect.top <= playZoneRect.bottom
    );
  }

  function resetSpread() {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    setCardPositions({});
    setDraggingId(null);
    setLiftingId(null);
    setPlayingId(null);
    setStackOrder(initialStackOrder);
    setDragRotations({});
    setCardOrigins({});
    setCardRotations(createRandomRotations(getBreakpoint(window.innerWidth)));

    if (mediaQuery.matches) {
      setHasDealt(true);
      setIsShuffling(false);
      return;
    }

    setHasDealt(false);
    setIsShuffling(true);
    window.setTimeout(() => setHasDealt(true), 520);
    window.setTimeout(() => setIsShuffling(false), 860);
  }

  function handlePointerDown(
    event: PointerEvent<HTMLAnchorElement>,
    cardId: CardId,
  ) {
    if (event.button !== 0 || playingId) {
      return;
    }

    const tableRect = tableRef.current?.getBoundingClientRect();

    if (!tableRect) {
      return;
    }

    const center = getCardCenter(cardId);
    const cardRect = event.currentTarget.getBoundingClientRect();
    const pointerX = event.clientX - tableRect.left;
    const pointerY = event.clientY - tableRect.top;
    const originX = clamp(event.clientX - cardRect.left, 0, cardRect.width);
    const originY = clamp(event.clientY - cardRect.top, 0, cardRect.height);
    const now = performance.now();

    dragRef.current = {
      id: cardId,
      pointerId: event.pointerId,
      offsetX: pointerX - center.x,
      offsetY: pointerY - center.y,
      hasMoved: false,
      lastX: pointerX,
      lastY: pointerY,
      lastTime: now,
      velocityX: 0,
      velocityY: 0,
      accelerationX: 0,
      accelerationY: 0,
      startRotation: cardRotations[cardId],
      smoothedRotation: 0,
      originX,
      originY,
      cardWidth: cardRect.width,
      cardHeight: cardRect.height,
      angularVelocity: 0,
    };

    setCardOrigins((current) => ({
      ...current,
      [cardId]: { x: originX, y: originY },
    }));
    setDragRotations((current) => ({
      ...current,
      [cardId]: 0,
    }));
    setLiftingId(cardId);
    setStackOrder((current) => [
      ...current.filter((id) => id !== cardId),
      cardId,
    ]);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLAnchorElement>) {
    const drag = dragRef.current;
    const tableRect = tableRef.current?.getBoundingClientRect();

    if (!drag || !tableRect || drag.pointerId !== event.pointerId) {
      return;
    }

    const x = event.clientX - tableRect.left - drag.offsetX;
    const y = event.clientY - tableRect.top - drag.offsetY;
    const pointerX = event.clientX - tableRect.left;
    const pointerY = event.clientY - tableRect.top;
    const now = performance.now();
    const deltaTime = Math.max(now - drag.lastTime, 16);
    const nextVelocityX = (pointerX - drag.lastX) / deltaTime;
    const nextVelocityY = (pointerY - drag.lastY) / deltaTime;
    const nextAccelerationX = (nextVelocityX - drag.velocityX) / deltaTime;
    const nextAccelerationY = (nextVelocityY - drag.velocityY) / deltaTime;

    drag.accelerationX = drag.accelerationX * 0.72 + nextAccelerationX * 0.28;
    drag.accelerationY = drag.accelerationY * 0.72 + nextAccelerationY * 0.28;
    drag.angularVelocity =
      drag.angularVelocity * 0.72 +
      (((drag.originX - drag.cardWidth / 2) * nextVelocityY -
        (drag.originY - drag.cardHeight / 2) * nextVelocityX) /
        Math.max(drag.cardWidth * drag.cardHeight, 1)) *
        0.28;
    drag.velocityX = drag.velocityX * 0.55 + nextVelocityX * 0.45;
    drag.velocityY = drag.velocityY * 0.55 + nextVelocityY * 0.45;
    drag.lastX = pointerX;
    drag.lastY = pointerY;
    drag.lastTime = now;

    const clampedPosition = clampToTable(x, y, { allowPlayArea: true });

    if (!drag.hasMoved) {
      drag.hasMoved = true;
      window.setTimeout(() => {
        if (dragRef.current?.id === drag.id) {
          setLiftingId(null);
          setDraggingId(drag.id);
        }
      }, 110);
    }

    setCardPositions((current) => ({
      ...current,
      [drag.id]: clampedPosition,
    }));
    const targetRotation = createDragRotation(drag, breakpoint);
    drag.smoothedRotation = Number(
      (drag.smoothedRotation * 0.68 + targetRotation * 0.32).toFixed(1),
    );
    setDragRotations((current) => ({
      ...current,
      [drag.id]: drag.smoothedRotation,
    }));
  }

  function handlePointerUp(event: PointerEvent<HTMLAnchorElement>) {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const card = actionCards.find((item) => item.id === drag.id);
    const finalPosition = getCardCenter(drag.id);
    const shouldPlay =
      drag.hasMoved && isInsidePlayZone(finalPosition.x, finalPosition.y);

    dragRef.current = null;
    setLiftingId(null);
    setDraggingId(null);
    setDragRotations((current) => {
      const { [drag.id]: _releasedRotation, ...remaining } = current;
      return remaining;
    });

    if (drag.hasMoved) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }

    if (card && shouldPlay) {
      setPlayingId(card.id);
      window.setTimeout(() => navigateToCard(card), 260);
      return;
    }

    if (drag.hasMoved) {
      const settledPosition = clampToTable(finalPosition.x, finalPosition.y);

      setCardPositions((current) => ({
        ...current,
        [drag.id]: settledPosition,
      }));
      setCardRotations((current) => ({
        ...current,
        [drag.id]: createMomentumDropRotation(drag, breakpoint),
      }));
    }
  }

  function handleCardClick(
    event: MouseEvent<HTMLAnchorElement>,
    card: ActionCard,
  ) {
    if (suppressClickRef.current || playingId) {
      event.preventDefault();
      return;
    }

    if (!isMailLink(card.to)) {
      event.preventDefault();
      navigateToCard(card);
    }
  }

  return (
    <main
      className="text-ink relative min-h-svh overflow-hidden bg-[radial-gradient(circle_at_50%_38%,rgba(255,253,248,0.24),transparent_30%),linear-gradient(145deg,#194936,#102f28_72%)]"
      ref={tableRef}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(246,242,233,0.16),transparent_20%),radial-gradient(circle_at_86%_76%,rgba(166,109,47,0.16),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-2/3 border-b border-white/12 bg-white/[0.035] shadow-[0_22px_90px_rgba(255,253,248,0.05)_inset] sm:h-1/3" />
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-x-0 top-0 z-0 h-2/3 transition sm:h-1/3",
          draggingId
            ? "bg-white/[0.075] shadow-[0_0_90px_rgba(255,253,248,0.13)_inset]"
            : "bg-transparent",
        ].join(" ")}
        ref={playZoneRef}
      />

      <section
        aria-label="Interactive card table navigation"
        className="absolute inset-0 overflow-hidden"
      >
          <div className="pointer-events-none absolute left-4 top-5 z-10 max-w-[18rem] sm:left-8 sm:top-8 sm:max-w-md lg:max-w-lg">
            <p className="mb-3 text-[0.65rem] font-bold tracking-[0.28em] text-white/62 uppercase sm:text-xs">
              Software / DevOps / Information Systems
            </p>
            <h1 className="font-serif text-4xl leading-none text-white sm:text-6xl lg:text-7xl xl:text-8xl">
              Alireza Afshan
            </h1>
          </div>

          <div
            aria-hidden="true"
            className={[
              "card-deck-stack pointer-events-none absolute left-1/2 top-[78%] z-10 h-36 w-24 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 sm:top-[65%] sm:h-44 sm:w-28",
              hasDealt ? "opacity-0" : "opacity-100",
              isShuffling ? "is-shuffling" : "",
            ].join(" ")}
          >
            <div className="deck-card -rotate-6" />
            <div className="deck-card rotate-3" />
            <div className="deck-card rotate-0" />
          </div>

          {actionCards.map((card, index) => {
            const storedPosition = cardPositions[card.id];
            const spreadPosition = positions[card.id];
            const isDragging = draggingId === card.id;
            const isLifting = liftingId === card.id;
            const isPlaying = playingId === card.id;
            const stackIndex = stackOrder.indexOf(card.id);
            const cardOrigin = cardOrigins[card.id];
            const left = storedPosition
              ? `${storedPosition.x}px`
              : `${spreadPosition.x}%`;
            const top = storedPosition
              ? `${storedPosition.y}px`
              : `${spreadPosition.y}%`;
            const rotate = isPlaying
              ? 0
              : isDragging || isLifting
                ? (dragRotations[card.id] ?? 0)
                : cardRotations[card.id];

            return (
              <a
                aria-label={`Play ${card.title}`}
                className={[
                  "playing-action-card group absolute flex aspect-[2.5/3.5] w-[6.35rem] select-none flex-col justify-between rounded-xl border bg-card p-2.5 text-left shadow-[0_18px_36px_rgba(23,33,38,0.18)] outline-none transition-[filter,box-shadow] duration-200 [touch-action:none] sm:w-36 sm:p-4 md:w-40 lg:w-44",
                  card.accent === "red"
                    ? "border-red-950/15 text-[#9b3f36]"
                    : "border-slate-950/15 text-ink",
                  hasDealt
                    ? "pointer-events-auto opacity-100"
                    : "pointer-events-none opacity-0",
                  isDragging
                    ? "is-dragging z-40 cursor-grabbing brightness-105 shadow-[0_34px_80px_rgba(0,0,0,0.28)]"
                    : isLifting
                      ? "is-lifting z-40 cursor-grabbing brightness-105 shadow-[0_30px_74px_rgba(0,0,0,0.24)]"
                    : "cursor-grab hover:brightness-105 hover:shadow-[0_28px_70px_rgba(0,0,0,0.24)] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#14382f]",
                  isPlaying
                    ? "is-playing z-50 brightness-110 shadow-[0_34px_90px_rgba(255,253,248,0.18)]"
                    : "",
                ].join(" ")}
                draggable={false}
                href={card.to}
                onClick={(event) => handleCardClick(event, card)}
                onPointerCancel={handlePointerUp}
                onPointerDown={(event) => handlePointerDown(event, card.id)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                style={{
                  left,
                  top,
                  "--card-rotate": `${rotate}deg`,
                  "--card-origin-x": cardOrigin
                    ? `${cardOrigin.x}px`
                    : "50%",
                  "--card-origin-y": cardOrigin
                    ? `${cardOrigin.y}px`
                    : "50%",
                  zIndex: isPlaying ? 80 : isDragging ? 70 : 20 + stackIndex,
                  transitionDelay:
                    hasDealt || storedPosition ? "0ms" : `${index * 95}ms`,
                } as CSSProperties}
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="font-serif text-2xl leading-none sm:text-3xl">
                    {card.rank}
                  </span>
                  <span className="text-2xl leading-none sm:text-3xl">
                    {card.suit}
                  </span>
                </span>

                <span className="text-center">
                  <span className="text-ink block text-xs font-extrabold tracking-[0.14em] uppercase sm:text-sm">
                    {card.title}
                  </span>
                  <span className="text-muted mt-2 block text-[0.68rem] leading-5 sm:text-xs">
                    {card.summary}
                  </span>
                </span>

                <span className="flex items-end justify-between gap-2">
                  <span className="rotate-180 text-2xl leading-none sm:text-3xl">
                    {card.suit}
                  </span>
                  <span className="border-line text-muted rounded-full border px-2 py-1 text-[0.62rem] font-bold tracking-[0.16em] uppercase opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100 sm:opacity-100">
                    Play
                  </span>
                  
                </span>
              </a>
            );
          })}

          <div className="absolute bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
            <button
              className="rounded-full border border-white/30 bg-white/12 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              onClick={resetSpread}
              type="button"
            >
              Shuffle again
            </button>
          </div>
      </section>
    </main>
  );
}
