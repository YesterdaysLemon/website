import type { CSSProperties, MouseEvent, PointerEvent } from "react";
import type { Route } from "./+types/home";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  actionCards,
  clamp,
  clampPositionToTable,
  clampStoredPositions,
  createBaseRotations,
  createDragRotation,
  createMomentumDropRotation,
  createRandomRotations,
  getBreakpoint,
  initialStackOrder,
  isMailLink,
  jokerDestinations,
  spreadPositions,
  type ActionCard,
  type Breakpoint,
  type CardId,
  type CardOrigin,
  type CardRotations,
  type DragState,
  type PixelPosition,
} from "~/lib/home-card-table";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "alireza afshan" },
    {
      name: "description",
      content:
        "Software developer building inspectable tools, backend systems, simulations, research software, and carefully weird web experiments.",
    },
  ];
}

export default function Home() {
  const tableRef = useRef<HTMLDivElement | null>(null);
  const playZoneRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");
  const [hasDealt, setHasDealt] = useState(false);
  const [isShuffling, setIsShuffling] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showPlayHint, setShowPlayHint] = useState(false);
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
      const nextBreakpoint = getBreakpoint(window.innerWidth);
      const tableRect = tableRef.current?.getBoundingClientRect();

      setBreakpoint(nextBreakpoint);
      if (tableRect) {
        setCardOrigins({});
        setDragRotations({});
        setCardRotations(createBaseRotations(nextBreakpoint));
        setCardPositions((current) =>
          clampStoredPositions(
            current,
            { width: tableRect.width, height: tableRect.height },
            nextBreakpoint,
          ),
        );
      }
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

  useEffect(() => {
    if (hasInteracted) {
      setShowPlayHint(false);
      return;
    }

    const hintTimer = window.setTimeout(() => {
      setShowPlayHint(true);
    }, 1450);

    return () => window.clearTimeout(hintTimer);
  }, [hasInteracted]);

  function navigateToCard(card: ActionCard) {
    if (card.id === "joker") {
      const destination =
        jokerDestinations[Math.floor(Math.random() * jokerDestinations.length)];
      window.location.assign(destination);
      return;
    }

    if (isMailLink(card.to)) {
      window.location.href = card.to;
      return;
    }

    window.location.assign(card.to);
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

    return clampPositionToTable(
      { x, y },
      { width: tableRect.width, height: tableRect.height },
      breakpoint,
      options,
    );
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

  function handlePointerDown(
    event: PointerEvent<HTMLAnchorElement>,
    cardId: CardId,
  ) {
    if (event.button !== 0 || playingId || dragRef.current) {
      return;
    }

    setHasInteracted(true);
    resetCardTilt(event.currentTarget);

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

    if (!drag) {
      if (event.pointerType !== "touch" && !playingId) {
        const cardRect = event.currentTarget.getBoundingClientRect();
        const pointerX = clamp(
          (event.clientX - cardRect.left) / cardRect.width,
          0,
          1,
        );
        const pointerY = clamp(
          (event.clientY - cardRect.top) / cardRect.height,
          0,
          1,
        );

        event.currentTarget.style.setProperty(
          "--home-card-tilt-x",
          `${((0.5 - pointerY) * 16).toFixed(2)}deg`,
        );
        event.currentTarget.style.setProperty(
          "--home-card-tilt-y",
          `${((pointerX - 0.5) * 20).toFixed(2)}deg`,
        );
        event.currentTarget.style.setProperty(
          "--home-card-glow-x",
          `${(pointerX * 100).toFixed(1)}%`,
        );
        event.currentTarget.style.setProperty(
          "--home-card-glow-y",
          `${(pointerY * 100).toFixed(1)}%`,
        );
      }
      return;
    }

    if (!tableRect || drag.pointerId !== event.pointerId) {
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

  function finishPointerInteraction(
    event: PointerEvent<HTMLAnchorElement>,
    cancelled: boolean,
  ) {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const tableRect = tableRef.current?.getBoundingClientRect();
    const card = actionCards.find((item) => item.id === drag.id);
    const finalPosition = tableRect
      ? clampToTable(
          event.clientX - tableRect.left - drag.offsetX,
          event.clientY - tableRect.top - drag.offsetY,
          { allowPlayArea: true },
        )
      : getCardCenter(drag.id);
    const shouldPlay =
      !cancelled &&
      drag.hasMoved &&
      isInsidePlayZone(finalPosition.x, finalPosition.y);

    dragRef.current = null;
    resetCardTilt(event.currentTarget);
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      // Browsers may release capture before dispatching pointercancel.
    }
    setLiftingId(null);
    setDraggingId(null);
    setDragRotations((current) => {
      const { [drag.id]: _releasedRotation, ...remaining } = current;
      return remaining;
    });

    if (drag.hasMoved || cancelled) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }

    if (card && shouldPlay) {
      setCardPositions((current) => ({
        ...current,
        [drag.id]: finalPosition,
      }));
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
      if (!cancelled) {
        setCardRotations((current) => ({
          ...current,
          [drag.id]: createMomentumDropRotation(drag, breakpoint),
        }));
      }
    }
  }

  function handlePointerUp(event: PointerEvent<HTMLAnchorElement>) {
    finishPointerInteraction(event, false);
  }

  function handlePointerCancel(event: PointerEvent<HTMLAnchorElement>) {
    finishPointerInteraction(event, true);
  }

  function handleCardClick(
    event: MouseEvent<HTMLAnchorElement>,
    card: ActionCard,
  ) {
    setHasInteracted(true);

    if (suppressClickRef.current || playingId) {
      event.preventDefault();
      return;
    }

    resetCardTilt(event.currentTarget);

    if (!isMailLink(card.to)) {
      event.preventDefault();
      navigateToCard(card);
    }
  }

  function resetCardTilt(card: HTMLAnchorElement) {
    card.style.setProperty("--home-card-tilt-x", "0deg");
    card.style.setProperty("--home-card-tilt-y", "0deg");
    card.style.setProperty("--home-card-glow-x", "50%");
    card.style.setProperty("--home-card-glow-y", "50%");
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

      <div
        aria-hidden="true"
        className={[
          "card-play-hint",
          showPlayHint ? "is-visible" : "",
          draggingId ? "is-active" : "",
        ].join(" ")}
      >
        <span className="card-play-hint-arrow">↑</span>
        <span>
          <strong>Pick a card.</strong>
          <small>Or drag one into the light to play it.</small>
        </span>
      </div>

      <section
        aria-label="Interactive card table navigation"
        className="absolute inset-0 overflow-hidden"
      >
        <div className="pointer-events-none absolute top-5 left-4 z-10 max-w-[18rem] sm:top-8 sm:left-8 sm:max-w-md lg:max-w-lg">
          <p className="mb-3 text-[0.65rem] font-bold tracking-[0.28em] text-white/62 uppercase sm:text-xs">
            Software / Systems / Carefully Weird Experiments
          </p>
          <h1 className="font-serif text-4xl leading-none text-white sm:text-6xl lg:text-7xl xl:text-8xl">
            Alireza Afshan
          </h1>
        </div>

        <div
          aria-hidden="true"
          className={[
            "card-deck-stack pointer-events-none absolute top-[78%] left-1/2 z-10 h-36 w-24 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 sm:top-[65%] sm:h-44 sm:w-28",
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
              aria-label={`Open ${card.title}`}
              aria-description={card.summary}
              key={card.id}
              className={[
                "playing-action-card absolute flex aspect-[2.5/3.5] w-[6.35rem] [touch-action:none] flex-col justify-between rounded-[var(--radius)] border border-[var(--line)] bg-[var(--warm-card)] p-2.5 text-left text-[var(--route-accent)] shadow-[0_18px_42px_rgba(21,25,24,0.16)] transition-[filter,box-shadow] duration-200 outline-none select-none sm:w-36 sm:p-4 md:w-40 lg:w-44",
                hasDealt
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-0",
                isDragging
                  ? "is-dragging z-40 cursor-grabbing shadow-[0_34px_80px_rgba(0,0,0,0.28)] brightness-105"
                  : isLifting
                    ? "is-lifting z-40 cursor-grabbing shadow-[0_30px_74px_rgba(0,0,0,0.24)] brightness-105"
                    : "cursor-grab hover:shadow-[0_28px_70px_rgba(0,0,0,0.24)] hover:brightness-105 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#14382f]",
                isPlaying
                  ? "is-playing z-50 shadow-[0_34px_90px_rgba(255,253,248,0.18)] brightness-110"
                  : "",
                card.id === "joker" ? "is-joker" : "",
                hasDealt && !isDragging && !isLifting && !isPlaying
                  ? "is-idle"
                  : "",
              ].join(" ")}
              draggable={false}
              href={card.to}
              title={card.summary}
              onClick={(event) => handleCardClick(event, card)}
              onPointerCancel={handlePointerCancel}
              onPointerDown={(event) => handlePointerDown(event, card.id)}
              onPointerLeave={(event) => resetCardTilt(event.currentTarget)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              style={
                {
                  left,
                  top,
                  "--route-accent": card.accent,
                  "--card-rotate": `${rotate}deg`,
                  "--card-origin-x": cardOrigin ? `${cardOrigin.x}px` : "50%",
                  "--card-origin-y": cardOrigin ? `${cardOrigin.y}px` : "50%",
                  "--idle-index": index,
                  zIndex: isPlaying ? 80 : isDragging ? 70 : 20 + stackIndex,
                  transitionDelay:
                    hasDealt || storedPosition ? "0ms" : `${index * 95}ms`,
                } as CSSProperties
              }
            >
              <span className="flex items-start justify-between gap-2">
                <span className="font-serif text-3xl leading-none sm:text-4xl">
                  {card.rank}
                </span>
                <span className="text-3xl leading-none sm:text-4xl">
                  {card.suit}
                </span>
              </span>

              <span className="flex min-h-0 flex-1 items-center justify-center px-1 text-center">
                <span className="text-xs font-extrabold tracking-[0.18em] uppercase sm:text-sm">
                  {card.title}
                </span>
              </span>

              <span className="flex items-end justify-between gap-2">
                <span className="rotate-180 text-3xl leading-none sm:text-4xl">
                  {card.suit}
                </span>
                <span className="rotate-180 font-serif text-3xl leading-none sm:text-4xl">
                  {card.rank}
                </span>
              </span>
            </a>
          );
        })}
      </section>
    </main>
  );
}
