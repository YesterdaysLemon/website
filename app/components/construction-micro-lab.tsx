import type { CSSProperties, MouseEvent } from "react";

import { useEffect, useRef, useState } from "react";

const assetPath = (asset: string) => `/under-construction/${asset}`;

const bouncingCrew = [
  {
    angle: 31,
    asset: "verycoolskullwithhardhatandshovelslikeajollyroger.gif",
    rotation: -7,
    startX: 0.16,
    startY: 0.22,
  },
  {
    angle: 143,
    asset: "undrkunstuksonwithhammer.gif",
    rotation: 6,
    startX: 0.74,
    startY: 0.2,
  },
  {
    angle: -37,
    asset: "skullpoppingoutofholewithconstructiondebris.gif",
    rotation: 4,
    startX: 0.38,
    startY: 0.7,
  },
] as const;

const paceLabels = ["Union pace", "Regular hustle", "Deadline mode"] as const;
const paceSpeeds = [48, 82, 128] as const;

type BouncingBody = {
  element: HTMLButtonElement;
  height: number;
  radius: number;
  rotation: number;
  velocityX: number;
  velocityY: number;
  width: number;
  x: number;
  y: number;
};

function SiteScreensaver() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const spriteRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const bodiesRef = useRef<BouncingBody[]>([]);
  const [pace, setPace] = useState(1);
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastHit, setLastHit] = useState<number | null>(null);

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let animationFrame = 0;
    let previousTime = performance.now();
    let bodies: BouncingBody[] = [];

    const renderBody = (body: BouncingBody) => {
      body.element.style.transform = `translate3d(${body.x - body.width / 2}px, ${
        body.y - body.height / 2
      }px, 0) rotate(${body.rotation}deg)`;
    };

    const keepInsideStage = (
      body: BouncingBody,
      width: number,
      height: number,
    ) => {
      const halfWidth = body.width / 2;
      const halfHeight = body.height / 2;

      if (body.x - halfWidth < 0) {
        body.x = halfWidth;
        body.velocityX = Math.abs(body.velocityX);
      } else if (body.x + halfWidth > width) {
        body.x = width - halfWidth;
        body.velocityX = -Math.abs(body.velocityX);
      }

      if (body.y - halfHeight < 0) {
        body.y = halfHeight;
        body.velocityY = Math.abs(body.velocityY);
      } else if (body.y + halfHeight > height) {
        body.y = height - halfHeight;
        body.velocityY = -Math.abs(body.velocityY);
      }
    };

    const resolveCollisions = () => {
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
          const minimumDistance = first.radius + second.radius;
          const distanceSquared = deltaX * deltaX + deltaY * deltaY;

          if (distanceSquared >= minimumDistance * minimumDistance) {
            continue;
          }

          const distance = Math.sqrt(distanceSquared) || 1;
          const normalX = deltaX / distance;
          const normalY = deltaY / distance;
          const overlap = minimumDistance - distance;
          const relativeVelocityX = second.velocityX - first.velocityX;
          const relativeVelocityY = second.velocityY - first.velocityY;
          const velocityAlongNormal =
            relativeVelocityX * normalX + relativeVelocityY * normalY;

          first.x -= normalX * overlap * 0.5;
          first.y -= normalY * overlap * 0.5;
          second.x += normalX * overlap * 0.5;
          second.y += normalY * overlap * 0.5;

          if (velocityAlongNormal < 0) {
            first.velocityX += velocityAlongNormal * normalX;
            first.velocityY += velocityAlongNormal * normalY;
            second.velocityX -= velocityAlongNormal * normalX;
            second.velocityY -= velocityAlongNormal * normalY;
          }
        }
      }
    };

    const buildBodies = () => {
      const stageRect = stage.getBoundingClientRect();

      bodies = bouncingCrew.flatMap((sprite, index) => {
        const element = spriteRefs.current[index];

        if (!element) {
          return [];
        }

        const spriteRect = element.getBoundingClientRect();
        const width = spriteRect.width || 60;
        const height = spriteRect.height || 60;
        const angle = (sprite.angle * Math.PI) / 180;
        const speed = paceSpeeds[pace] * (1 + index * 0.08);
        const body: BouncingBody = {
          element,
          height,
          radius: Math.min(width, height) * 0.38,
          rotation: sprite.rotation,
          velocityX: Math.cos(angle) * speed,
          velocityY: Math.sin(angle) * speed,
          width,
          x: stageRect.width * sprite.startX,
          y: stageRect.height * sprite.startY,
        };

        keepInsideStage(body, stageRect.width, stageRect.height);
        renderBody(body);
        return [body];
      });
      bodiesRef.current = bodies;
    };

    const start = () => {
      window.cancelAnimationFrame(animationFrame);
      buildBodies();

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

        resolveCollisions();
        bodies.forEach((body) => {
          keepInsideStage(body, stageRect.width, stageRect.height);
          renderBody(body);
        });
        animationFrame = window.requestAnimationFrame(tick);
      };

      animationFrame = window.requestAnimationFrame(tick);
    };

    const resizeObserver = new ResizeObserver(start);
    resizeObserver.observe(stage);
    motionPreference.addEventListener("change", start);
    start();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      motionPreference.removeEventListener("change", start);
      bodiesRef.current = [];
    };
  }, [pace]);

  useEffect(() => {
    if (!isShiftActive) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setIsShiftActive(false);
          setStreak(0);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isShiftActive]);

  useEffect(() => {
    if (!isShiftActive && score > 0) {
      setBestScore((current) => Math.max(current, score));
    }
  }, [isShiftActive, score]);

  function startShift() {
    setScore(0);
    setStreak(0);
    setTimeLeft(20);
    setLastHit(null);
    setIsShiftActive(true);
  }

  function inspectWorker(event: MouseEvent<HTMLButtonElement>, index: number) {
    event.stopPropagation();

    if (!isShiftActive) {
      return;
    }

    const body = bodiesRef.current[index];

    if (body) {
      body.velocityX =
        Math.sign(body.velocityX || 1) *
        Math.min(Math.abs(body.velocityX) * 1.08, 220);
      body.velocityY =
        Math.sign(body.velocityY || 1) *
        Math.min(Math.abs(body.velocityY) * 1.08, 220);
      body.rotation += 17;
    }

    setScore((current) => current + 10 + Math.min(streak, 5) * 3);
    setStreak((current) => current + 1);
    setLastHit(index);
  }

  const shiftMessage = isShiftActive
    ? `${timeLeft}s left · keep the inspection streak alive`
    : score > 0
      ? `Shift complete · ${score} points logged`
      : "Start a 20-second shift, then catch the crew";

  return (
    <article className="micro-lab-card micro-lab-screensaver">
      <div className="micro-lab-card-heading">
        <span>01</span>
        <div>
          <p>Tiny score attack</p>
          <h3>Crew safety audit</h3>
        </div>
      </div>

      <div
        aria-label="Catch the moving construction workers during a timed safety audit"
        className="micro-bounce-stage"
        onClick={() => {
          if (isShiftActive) {
            setStreak(0);
          }
        }}
        ref={stageRef}
      >
        {bouncingCrew.map((sprite, index) => (
          <button
            aria-label={`Inspect worker ${index + 1}`}
            className={[
              "micro-bounce-target",
              lastHit === index ? "is-hit" : "",
            ].join(" ")}
            disabled={!isShiftActive}
            key={sprite.asset}
            onAnimationEnd={() => {
              if (lastHit === index) {
                setLastHit(null);
              }
            }}
            onClick={(event) => inspectWorker(event, index)}
            ref={(element) => {
              spriteRefs.current[index] = element;
            }}
            type="button"
          >
            <img alt="" src={assetPath(sprite.asset)} />
          </button>
        ))}
        <div aria-live="polite" className="micro-game-scoreboard">
          <span>{score.toString().padStart(3, "0")} pts</span>
          <span>{streak > 1 ? `combo ×${streak}` : "find the crew"}</span>
        </div>
        <span className="micro-screen-corner">
          20 SECOND SAFETY AUDIT · MISSES BREAK COMBO
        </span>
      </div>

      <div className="micro-lab-controls">
        <div className="micro-game-copy">
          <p aria-live="polite">{shiftMessage}</p>
          <span>Best this visit: {bestScore}</span>
        </div>
        <div className="micro-lab-actions">
          <button
            className="micro-lab-button"
            onClick={() =>
              setPace((current) => (current + 1) % paceLabels.length)
            }
            type="button"
          >
            {paceLabels[pace]}
          </button>
          <button
            className="micro-lab-button micro-lab-button-primary"
            onClick={startShift}
            type="button"
          >
            {isShiftActive ? "Restart" : "Start shift"}
          </button>
        </div>
      </div>
    </article>
  );
}

const incidentMessages = [
  "All structural buttons accounted for.",
  "That one was mostly decorative. Probably.",
  "A distant support beam has become nervous.",
  "The foreman would like a word.",
  "This was load-bearing. Reset immediately.",
] as const;

const incidentSprites = [
  "pinupcalanderladywithunderconstructionsign.gif",
  "anthropromorphisedhammerhittinganthronail.gif",
  "skullpoppingoutofholewithconstructiondebris.gif",
  "animeworkerswithsign.gif",
  "angryworkerholdingsigndoyouhaveaproblemwiththat.gif",
] as const;

function LoadBearingButton() {
  const [incidentLevel, setIncidentLevel] = useState(0);
  const isCritical = incidentLevel === incidentMessages.length - 1;

  function pressButton() {
    setIncidentLevel((current) =>
      current === incidentMessages.length - 1 ? 0 : current + 1,
    );
  }

  return (
    <article
      className={[
        "micro-lab-card micro-load-card",
        isCritical ? "is-critical" : "",
      ].join(" ")}
    >
      <div className="micro-lab-card-heading">
        <span>02</span>
        <div>
          <p>Safety control</p>
          <h3>Load-bearing button</h3>
        </div>
      </div>

      <div className="micro-load-stage">
        <img alt="" src={assetPath(incidentSprites[incidentLevel])} />
        <button
          aria-describedby="load-bearing-status"
          className="micro-danger-button"
          onClick={pressButton}
          type="button"
        >
          {isCritical ? "RESET" : "DO NOT PRESS"}
        </button>
      </div>

      <div
        aria-live="polite"
        className="micro-lab-readout"
        id="load-bearing-status"
      >
        <span>Incident level {incidentLevel}/4</span>
        <p>{incidentMessages[incidentLevel]}</p>
      </div>
    </article>
  );
}

function JackhammerCalibration() {
  const [pressure, setPressure] = useState(0);

  useEffect(() => {
    if (pressure <= 0) {
      return;
    }

    const drainTimer = window.setInterval(() => {
      setPressure((current) => Math.max(0, current - 2));
    }, 120);

    return () => window.clearInterval(drainTimer);
  }, [pressure > 0]);

  const isApproved = pressure >= 42 && pressure <= 70;
  const isOver = pressure > 70;
  const status = isApproved
    ? "PERMIT APPROVED"
    : isOver
      ? "TOO MUCH CONVICTION"
      : "NEEDS CONVICTION";

  return (
    <article
      className={[
        "micro-lab-card micro-jackhammer-card",
        isOver ? "is-over" : "",
      ].join(" ")}
    >
      <div className="micro-lab-card-heading">
        <span>03</span>
        <div>
          <p>Skill assessment</p>
          <h3>Jackhammer calibration</h3>
        </div>
      </div>

      <div className="micro-jackhammer-stage">
        <img alt="" src={assetPath("manusingjackhammerwithdifficulty.gif")} />
        <div
          className="micro-pressure-meter"
          role="meter"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={pressure}
        >
          <span className="micro-pressure-safe-zone" />
          <span style={{ width: `${pressure}%` }} />
        </div>
        <p aria-live="polite">{status}</p>
      </div>

      <button
        className="micro-lab-button micro-jackhammer-button"
        onClick={() => setPressure((current) => Math.min(100, current + 17))}
        type="button"
      >
        Apply enthusiasm
      </button>
    </article>
  );
}

const gearboxModes = [
  { label: "Offline for lunch", className: "is-off" },
  { label: "Questionably operational", className: "is-on" },
  { label: "Warranty voided", className: "is-turbo" },
] as const;

function Gearbox() {
  const [mode, setMode] = useState(0);
  const currentMode = gearboxModes[mode];

  return (
    <article className="micro-lab-card micro-gear-card">
      <div className="micro-lab-card-heading">
        <span>04</span>
        <div>
          <p>Infrastructure</p>
          <h3>Central gearbox</h3>
        </div>
      </div>

      <div
        className={`micro-gear-stage ${currentMode.className}`}
        style={{ "--gear-mode": mode } as CSSProperties}
      >
        <img
          alt=""
          className="micro-gear micro-gear-large"
          src={assetPath("gears1.gif")}
        />
        <img
          alt=""
          className="micro-gear micro-gear-small"
          src={assetPath("gears2.gif")}
        />
        <span>OUTPUT: {37 + mode * 31}% USEFUL</span>
      </div>

      <div className="micro-lab-controls">
        <p aria-live="polite">{currentMode.label}</p>
        <button
          className="micro-lab-button"
          onClick={() =>
            setMode((current) => (current + 1) % gearboxModes.length)
          }
          type="button"
        >
          Turn crank
        </button>
      </div>
    </article>
  );
}

const alignmentRounds = [
  { center: 26, speed: 27, width: 24 },
  { center: 72, speed: 32, width: 21 },
  { center: 44, speed: 38, width: 18 },
  { center: 80, speed: 44, width: 15 },
  { center: 36, speed: 51, width: 12 },
] as const;

type AlignmentPhase = "idle" | "moving" | "judged" | "complete";
type AlignmentResult = "perfect" | "aligned" | "near" | "miss" | null;

function paintAlignmentPosition(
  stage: HTMLDivElement | null,
  nextPosition: number,
) {
  const position = Math.max(4, Math.min(96, nextPosition));

  if (stage) {
    stage.style.setProperty("--alignment-position", `${position}%`);
    stage.setAttribute("aria-valuenow", Math.round(position).toString());
    stage.setAttribute(
      "aria-valuetext",
      `Suspended beam at ${Math.round(position)} percent across the rail`,
    );
  }

  return position;
}

function alignmentRating(score: number) {
  if (score >= 1050) {
    return "PLUMB LEGEND";
  }

  if (score >= 700) {
    return "UNION CERTIFIED";
  }

  if (score >= 350) {
    return "FUNCTIONALLY SQUARE";
  }

  return "SUPERVISED PRACTICE";
}

function BeamAlignment() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const positionRef = useRef(8);
  const directionRef = useRef(1);
  const [phase, setPhase] = useState<AlignmentPhase>("idle");
  const [result, setResult] = useState<AlignmentResult>(null);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [status, setStatus] = useState(
    "Five beams. The tolerance gets less philosophical each round.",
  );
  const currentRound = alignmentRounds[round];

  useEffect(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const syncMotionPreference = () =>
      setReducedMotion(motionPreference.matches);

    syncMotionPreference();
    motionPreference.addEventListener("change", syncMotionPreference);

    return () =>
      motionPreference.removeEventListener("change", syncMotionPreference);
  }, []);

  useEffect(() => {
    positionRef.current = paintAlignmentPosition(
      stageRef.current,
      positionRef.current,
    );

    if (phase !== "moving" || reducedMotion) {
      return;
    }

    let animationFrame = 0;
    let previousTime = performance.now();

    const tick = (time: number) => {
      const deltaTime = Math.min((time - previousTime) / 1000, 0.04);
      previousTime = time;
      let nextPosition =
        positionRef.current +
        directionRef.current * currentRound.speed * deltaTime;

      if (nextPosition >= 96) {
        nextPosition = 96 - (nextPosition - 96);
        directionRef.current = -1;
      } else if (nextPosition <= 4) {
        nextPosition = 4 + (4 - nextPosition);
        directionRef.current = 1;
      }

      positionRef.current = paintAlignmentPosition(
        stageRef.current,
        nextPosition,
      );
      animationFrame = window.requestAnimationFrame(tick);
    };

    animationFrame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [currentRound.speed, phase, reducedMotion]);

  function startAlignment() {
    positionRef.current = paintAlignmentPosition(stageRef.current, 8);
    directionRef.current = 1;
    setRound(0);
    setScore(0);
    setStreak(0);
    setResult(null);
    setStatus(
      reducedMotion
        ? "Beam one is ready. Use Jog crane, then set it inside the green zone."
        : "Beam one is live. Set it inside the green tolerance zone.",
    );
    setPhase("moving");
  }

  function loadNextBeam() {
    const nextRound = round + 1;
    const startsFromRight = nextRound % 2 === 1;

    positionRef.current = paintAlignmentPosition(
      stageRef.current,
      startsFromRight ? 92 : 8,
    );
    directionRef.current = startsFromRight ? -1 : 1;
    setRound(nextRound);
    setResult(null);
    setStatus(
      reducedMotion
        ? `Beam ${nextRound + 1} is ready. Jog the crane into tolerance.`
        : `Beam ${nextRound + 1} is moving. The tolerance just got pickier.`,
    );
    setPhase("moving");
  }

  function jogCrane() {
    if (phase !== "moving") {
      return;
    }

    let nextPosition = positionRef.current + directionRef.current * 6;

    if (nextPosition >= 96 || nextPosition <= 4) {
      directionRef.current *= -1;
      nextPosition = positionRef.current + directionRef.current * 6;
    }

    positionRef.current = paintAlignmentPosition(
      stageRef.current,
      nextPosition,
    );
  }

  function setBeam() {
    const distance = Math.abs(positionRef.current - currentRound.center);
    const halfWidth = currentRound.width / 2;
    const accuracy = Math.max(
      0,
      Math.round(100 - (distance / halfWidth) * 100),
    );
    let nextResult: Exclude<AlignmentResult, null>;
    let nextStreak = 0;
    let roundPoints = 0;
    let verdict = "That beam is exploring a personal angle.";

    if (distance <= Math.max(1.2, halfWidth * 0.2)) {
      nextResult = "perfect";
      nextStreak = streak + 1;
      roundPoints = 180 + round * 25 + accuracy + streak * 25;
      verdict = "Dead plumb. Euclid has been notified.";
    } else if (distance <= halfWidth) {
      nextResult = "aligned";
      nextStreak = streak + 1;
      roundPoints = 100 + round * 20 + accuracy + streak * 20;
      verdict = "Within tolerance. Nobody breathe.";
    } else if (distance <= halfWidth + 5) {
      nextResult = "near";
      roundPoints = 35 + round * 5;
      verdict = "Foreman says it counts from the road.";
    } else {
      nextResult = "miss";
    }

    const nextScore = score + roundPoints;
    const offset = `${distance.toFixed(1)}% off center`;
    const isFinalBeam = round === alignmentRounds.length - 1;

    setScore(nextScore);
    setStreak(nextStreak);
    setResult(nextResult);

    if (isFinalBeam) {
      setStatus(
        `${verdict} Shift complete: ${alignmentRating(nextScore)} · ${nextScore} points.`,
      );
      setPhase("complete");
      return;
    }

    setStatus(`${verdict} ${offset} · +${roundPoints.toString()} points.`);
    setPhase("judged");
  }

  function handlePrimaryAction() {
    if (phase === "idle" || phase === "complete") {
      startAlignment();
    } else if (phase === "judged") {
      loadNextBeam();
    } else {
      setBeam();
    }
  }

  const primaryLabel =
    phase === "idle"
      ? "Start alignment"
      : phase === "moving"
        ? "Set beam"
        : phase === "judged"
          ? "Next beam"
          : "Run it again";
  const helperText =
    phase === "complete"
      ? alignmentRating(score)
      : phase === "judged"
        ? "Inspection logged · load the next beam"
        : phase === "moving" && reducedMotion
          ? "Motion parked · use Jog crane to move"
          : phase === "moving"
            ? "Set the beam while it crosses the green zone"
            : "Five beams · tighter tolerances every round";
  const targetStart = currentRound.center - currentRound.width / 2;

  return (
    <article
      className={[
        "micro-lab-card micro-alignment-card",
        result ? `is-${result}` : "",
      ].join(" ")}
    >
      <div className="micro-lab-card-heading">
        <span>05</span>
        <div>
          <p>Timing certification</p>
          <h3>Beam alignment</h3>
        </div>
      </div>

      <div className="micro-alignment-layout">
        <div
          aria-label={`Crane rail. Target centered at ${currentRound.center} percent with ${currentRound.width} percent tolerance.`}
          aria-valuemax={96}
          aria-valuemin={4}
          aria-valuenow={8}
          aria-valuetext="Suspended beam at 8 percent across the rail"
          className="micro-alignment-stage"
          ref={stageRef}
          role="meter"
          style={
            {
              "--alignment-position": "8%",
              "--alignment-target-left": `${targetStart}%`,
              "--alignment-target-width": `${currentRound.width}%`,
            } as CSSProperties
          }
        >
          <span aria-hidden="true" className="micro-alignment-target">
            <span>SET ZONE</span>
          </span>
          <span aria-hidden="true" className="micro-alignment-hook">
            <span className="micro-alignment-block" />
            <span className="micro-alignment-beam" />
          </span>
          <img
            alt=""
            className="micro-alignment-foreman"
            src={assetPath("manhammeringwhileonhandsandknees.gif")}
          />
          <span aria-hidden="true" className="micro-alignment-ruler">
            {[0, 20, 40, 60, 80, 100].map((label) => (
              <span key={label}>{label}</span>
            ))}
          </span>
        </div>

        <div className="micro-alignment-panel">
          <div className="micro-alignment-scoreboard">
            <span>
              Beam {round + 1}/{alignmentRounds.length}
            </span>
            <span>{score.toString().padStart(4, "0")} pts</span>
            <span>
              {streak > 1 ? `${streak}× plumb streak` : "No streak yet"}
            </span>
          </div>
          <div className="micro-lab-readout micro-alignment-readout">
            <span>Tolerance ±{(currentRound.width / 2).toFixed(1)}%</span>
            <p aria-live="polite">{status}</p>
          </div>
        </div>
      </div>

      <div className="micro-lab-controls micro-alignment-controls">
        <div className="micro-game-copy">
          <p>{helperText}</p>
          <span>Best possible title: Plumb legend</span>
        </div>
        <div className="micro-lab-actions">
          <button
            className="micro-lab-button"
            disabled={phase !== "moving"}
            onClick={jogCrane}
            type="button"
          >
            Jog crane
          </button>
          <button
            aria-keyshortcuts="Enter Space"
            className="micro-lab-button micro-lab-button-primary"
            onClick={handlePrimaryAction}
            type="button"
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </article>
  );
}

export function ConstructionMicroLab() {
  return (
    <div
      aria-label="Tiny interactive construction experiments"
      className="micro-lab-grid"
    >
      <SiteScreensaver />
      <LoadBearingButton />
      <JackhammerCalibration />
      <Gearbox />
      <BeamAlignment />
    </div>
  );
}
