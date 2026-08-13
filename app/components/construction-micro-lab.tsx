import type {
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
} from "react";

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
const crewCallSigns = ["Skull foreman", "Hammer tech", "Tunnel crew"] as const;
const inspectionSequence = [0, 2, 1, 0, 1, 2, 0, 2, 1, 2, 0, 1] as const;

function inspectionGrade(score: number) {
  if (score >= 520) {
    return "SITE HAWK";
  }

  if (score >= 320) {
    return "CLIPBOARD WIZARD";
  }

  if (score >= 150) {
    return "VISIBLE VEST";
  }

  return "PROBATIONARY LANYARD";
}

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
  const sequenceRef = useRef(0);
  const assignmentStartedRef = useRef(0);
  const [pace, setPace] = useState(1);
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [targetIndex, setTargetIndex] = useState<number>(inspectionSequence[0]);
  const [lastHit, setLastHit] = useState<number | null>(null);
  const [lastWrong, setLastWrong] = useState<number | null>(null);
  const [feedback, setFeedback] = useState(
    "Dispatch is waiting for someone to pick up the clipboard.",
  );

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
          setFeedback(
            "Shift over. The clipboard has been returned, reluctantly.",
          );
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

  useEffect(() => {
    if (isShiftActive && timeLeft <= 0) {
      setIsShiftActive(false);
      setStreak(0);
      setFeedback("Audit ended early. Dispatch has confiscated the stopwatch.");
    }
  }, [isShiftActive, timeLeft]);

  function startShift() {
    sequenceRef.current = 0;
    assignmentStartedRef.current = performance.now();
    setScore(0);
    setStreak(0);
    setTimeLeft(20);
    setTargetIndex(inspectionSequence[0]);
    setLastHit(null);
    setLastWrong(null);
    setFeedback(
      `Dispatch: locate the ${crewCallSigns[inspectionSequence[0]]}.`,
    );
    setIsShiftActive(true);
  }

  function inspectWorker(event: MouseEvent<HTMLButtonElement>, index: number) {
    event.stopPropagation();

    if (!isShiftActive) {
      return;
    }

    if (index !== targetIndex) {
      setScore((current) => Math.max(0, current - 12));
      setTimeLeft((current) => Math.max(0, current - 2));
      setStreak(0);
      setLastHit(null);
      setLastWrong(index);
      setFeedback(
        `Wrong hard hat. ${crewCallSigns[index]} cost the audit 2 seconds.`,
      );
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

    const reactionTime = performance.now() - assignmentStartedRef.current;
    const speedBonus = Math.max(0, 20 - Math.floor(reactionTime / 140));
    const points = 25 + Math.min(streak, 5) * 5 + speedBonus;
    const nextSequence = (sequenceRef.current + 1) % inspectionSequence.length;
    const nextTarget = inspectionSequence[nextSequence];

    sequenceRef.current = nextSequence;
    assignmentStartedRef.current = performance.now();
    setScore((current) => current + points);
    setStreak((current) => current + 1);
    setTargetIndex(nextTarget);
    setLastHit(index);
    setLastWrong(null);
    setFeedback(
      `${crewCallSigns[index]} cleared in ${(reactionTime / 1000).toFixed(1)}s · +${points} points.`,
    );
  }

  function missInspection() {
    if (!isShiftActive) {
      return;
    }

    setScore((current) => Math.max(0, current - 5));
    setTimeLeft((current) => Math.max(0, current - 1));
    setStreak(0);
    setFeedback("Inspected some perfectly ordinary air. Minus 1 second.");
  }

  const shiftMessage = isShiftActive
    ? feedback
    : timeLeft === 0
      ? score > 0
        ? `Shift complete · ${inspectionGrade(score)} · ${score} points`
        : feedback
      : "Match each dispatch order to the right moving worker";

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
        onClick={missInspection}
        ref={stageRef}
      >
        {bouncingCrew.map((sprite, index) => (
          <button
            aria-label={`Inspect ${crewCallSigns[index]}`}
            className={[
              "micro-bounce-target",
              lastHit === index ? "is-hit" : "",
              lastWrong === index ? "is-wrong" : "",
            ].join(" ")}
            disabled={!isShiftActive}
            key={sprite.asset}
            onAnimationEnd={() => {
              if (lastHit === index) {
                setLastHit(null);
              }
              if (lastWrong === index) {
                setLastWrong(null);
              }
            }}
            onClick={(event) => inspectWorker(event, index)}
            ref={(element) => {
              spriteRefs.current[index] = element;
            }}
            type="button"
          >
            <img alt="" src={assetPath(sprite.asset)} />
            <span>{crewCallSigns[index]}</span>
          </button>
        ))}
        <div aria-live="polite" className="micro-game-scoreboard">
          <span>{score.toString().padStart(3, "0")} pts</span>
          <span>{timeLeft.toString().padStart(2, "0")}s</span>
        </div>
        <div className="micro-dispatch-board">
          <span>Dispatch wants</span>
          <strong>
            {isShiftActive ? crewCallSigns[targetIndex] : "Awaiting shift"}
          </strong>
        </div>
        <span className="micro-screen-corner">
          CORRECT ORDERS BUILD COMBO · WRONG WORKER −2S
        </span>
      </div>

      <div className="micro-lab-controls">
        <div className="micro-game-copy">
          <p aria-live="polite">{shiftMessage}</p>
          <span>
            Best: {bestScore} ·{" "}
            {bestScore ? inspectionGrade(bestScore) : "ungraded"}
          </span>
        </div>
        <div className="micro-lab-actions">
          <button
            className="micro-lab-button"
            disabled={isShiftActive}
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

const incidentSprites = [
  "pinupcalanderladywithunderconstructionsign.gif",
  "anthropromorphisedhammerhittinganthronail.gif",
  "skullpoppingoutofholewithconstructiondebris.gif",
  "animeworkerswithsign.gif",
  "angryworkerholdingsigndoyouhaveaproblemwiththat.gif",
] as const;

const salvageDamage = [9, 12, 7, 15, 10, 18, 8, 14, 20, 11] as const;

type SalvagePhase = "idle" | "playing" | "banked" | "collapsed";

function LoadBearingButton() {
  const [phase, setPhase] = useState<SalvagePhase>("idle");
  const [integrity, setIntegrity] = useState(100);
  const [haul, setHaul] = useState(0);
  const [bestHaul, setBestHaul] = useState(0);
  const [presses, setPresses] = useState(0);
  const [runNumber, setRunNumber] = useState(0);
  const [status, setStatus] = useState(
    "Remove suspiciously valuable bolts, then bank the haul before the site folds.",
  );
  const isCritical = phase === "playing" && integrity <= 30;
  const incidentLevel =
    phase === "collapsed"
      ? incidentSprites.length - 1
      : Math.min(
          incidentSprites.length - 1,
          Math.floor((100 - integrity) / 22),
        );
  const nextReward = 35 + presses * 18 + Math.round((100 - integrity) * 0.6);

  function startSalvage() {
    setRunNumber((current) => current + 1);
    setIntegrity(100);
    setHaul(0);
    setPresses(0);
    setStatus(
      "Fresh structure. Every red-button press removes one profitable bolt.",
    );
    setPhase("playing");
  }

  function removeBolt() {
    if (phase !== "playing") {
      startSalvage();
      return;
    }

    const damage =
      salvageDamage[(presses + runNumber * 3) % salvageDamage.length];
    const nextIntegrity = Math.max(0, integrity - damage);
    const nextHaul = haul + nextReward;

    setIntegrity(nextIntegrity);
    setPresses((current) => current + 1);

    if (nextIntegrity <= 0) {
      setHaul(0);
      setStatus(
        `Structural enthusiasm exceeded specifications. ${nextHaul} unbanked points became rubble.`,
      );
      setPhase("collapsed");
      return;
    }

    setHaul(nextHaul);
    setStatus(
      nextIntegrity <= 30
        ? `The building is making legal noises. Bank ${nextHaul} or tempt physics again.`
        : nextIntegrity <= 55
          ? `That bolt was load-adjacent. ${nextHaul} points are still unbanked.`
          : `Bolt acquired. Integrity −${damage} · haul +${nextReward}.`,
    );
  }

  function bankSalvage() {
    if (phase !== "playing" || haul <= 0) {
      return;
    }

    setBestHaul((current) => Math.max(current, haul));
    setStatus(
      `${haul} points banked. The structure survives on a technicality.`,
    );
    setPhase("banked");
  }

  return (
    <article
      className={[
        "micro-lab-card micro-load-card",
        isCritical ? "is-critical" : "",
        phase === "collapsed" ? "is-collapsed" : "",
        phase === "banked" ? "is-banked" : "",
      ].join(" ")}
    >
      <div className="micro-lab-card-heading">
        <span>02</span>
        <div>
          <p>Push-your-luck salvage</p>
          <h3>Load-bearing button</h3>
        </div>
      </div>

      <div className="micro-load-stage">
        <div className="micro-salvage-scoreboard">
          <span>Integrity {integrity}%</span>
          <strong>
            {haul.toString().padStart(4, "0")}{" "}
            {phase === "banked" ? "banked" : "unbanked"}
          </strong>
        </div>
        <img alt="" src={assetPath(incidentSprites[incidentLevel])} />
        <div
          aria-label={`Structure integrity ${integrity} percent`}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={integrity}
          className="micro-integrity-meter"
          role="meter"
        >
          <span style={{ width: `${integrity}%` }} />
          <i />
          <i />
          <i />
        </div>
        <button
          aria-describedby="load-bearing-status"
          className="micro-danger-button"
          onClick={removeBolt}
          type="button"
        >
          {phase === "playing"
            ? `REMOVE BOLT +${nextReward}`
            : phase === "collapsed"
              ? "REBUILD SITE"
              : phase === "banked"
                ? "NEW SHIFT"
                : "START SALVAGE"}
        </button>
      </div>

      <div
        aria-live="polite"
        className="micro-lab-readout"
        id="load-bearing-status"
      >
        <span>
          {phase === "playing"
            ? `${presses} bolts removed · risk is optional`
            : `Best bank this visit: ${bestHaul}`}
        </span>
        <p>{status}</p>
      </div>

      <div className="micro-lab-controls micro-salvage-controls">
        <div className="micro-game-copy">
          <p>Collapse loses every unbanked point.</p>
          <span>The red button is still a terrible idea</span>
        </div>
        <button
          className="micro-lab-button micro-lab-button-primary"
          disabled={phase !== "playing" || haul <= 0}
          onClick={bankSalvage}
          type="button"
        >
          Bank haul
        </button>
      </div>
    </article>
  );
}

const calibrationSafeMinimum = 42;
const calibrationSafeMaximum = 70;

type CalibrationPhase = "idle" | "running" | "won" | "failed";
type CalibrationTelemetry = {
  certification: number;
  pressure: number;
  timeLeft: number;
};

function JackhammerCalibration() {
  const applyingRef = useRef(false);
  const [phase, setPhase] = useState<CalibrationPhase>("idle");
  const [isApplying, setIsApplying] = useState(false);
  const [bestMargin, setBestMargin] = useState(0);
  const [telemetry, setTelemetry] = useState<CalibrationTelemetry>({
    certification: 0,
    pressure: 0,
    timeLeft: 12,
  });
  const [finalStatus, setFinalStatus] = useState(
    "Hold, release, and feather the pressure inside the green zone for a full permit.",
  );

  useEffect(() => {
    if (phase !== "running") {
      return;
    }

    let previousTime = performance.now();
    const calibrationTimer = window.setInterval(() => {
      const time = performance.now();
      const deltaTime = Math.min((time - previousTime) / 1000, 0.12);
      previousTime = time;

      setTelemetry((current) => {
        const pressureChange = applyingRef.current ? 38 : -19;
        const pressure = Math.max(
          0,
          Math.min(100, current.pressure + pressureChange * deltaTime),
        );
        const isInSafeZone =
          pressure >= calibrationSafeMinimum &&
          pressure <= calibrationSafeMaximum;
        const certification = Math.max(
          0,
          Math.min(
            100,
            current.certification + (isInSafeZone ? 24 : -9) * deltaTime,
          ),
        );

        return {
          certification,
          pressure,
          timeLeft: Math.max(0, current.timeLeft - deltaTime),
        };
      });
    }, 50);

    return () => window.clearInterval(calibrationTimer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "running") {
      applyingRef.current = false;
      setIsApplying(false);
      return;
    }

    if (telemetry.certification >= 100) {
      const remaining = Math.max(0, telemetry.timeLeft);
      applyingRef.current = false;
      setBestMargin((current) => Math.max(current, remaining));
      setFinalStatus(
        `PERMIT STAMPED · ${remaining.toFixed(1)} seconds left on the clock.`,
      );
      setPhase("won");
    } else if (telemetry.pressure >= 96) {
      applyingRef.current = false;
      setFinalStatus("PRESSURE EVENT · the jackhammer has joined management.");
      setPhase("failed");
    } else if (telemetry.timeLeft <= 0) {
      applyingRef.current = false;
      setFinalStatus(
        "PERMIT DENIED · conviction wandered outside the green zone.",
      );
      setPhase("failed");
    }
  }, [phase, telemetry]);

  function startCalibration() {
    applyingRef.current = false;
    setIsApplying(false);
    setTelemetry({ certification: 0, pressure: 0, timeLeft: 12 });
    setFinalStatus(
      "Test live. Build pressure, then feather it inside the green zone.",
    );
    setPhase("running");
  }

  function beginApplying(event: PointerEvent<HTMLButtonElement>) {
    if (phase !== "running") {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    applyingRef.current = true;
    setIsApplying(true);
    setTelemetry((current) => ({
      ...current,
      pressure: Math.min(100, current.pressure + 4),
    }));
  }

  function stopApplying() {
    applyingRef.current = false;
    setIsApplying(false);
  }

  function handlePressureKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (
      phase !== "running" ||
      event.repeat ||
      (event.key !== " " && event.key !== "Enter")
    ) {
      return;
    }

    applyingRef.current = true;
    setIsApplying(true);
    setTelemetry((current) => ({
      ...current,
      pressure: Math.min(100, current.pressure + 4),
    }));
  }

  function handlePressureKeyUp(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === " " || event.key === "Enter") {
      stopApplying();
    }
  }

  const isSafe =
    telemetry.pressure >= calibrationSafeMinimum &&
    telemetry.pressure <= calibrationSafeMaximum;
  const isOver = telemetry.pressure > calibrationSafeMaximum;
  const liveStatus =
    telemetry.pressure < 32
      ? "BUILD PRESSURE"
      : telemetry.pressure < calibrationSafeMinimum
        ? "ALMOST IN TOLERANCE"
        : isSafe
          ? "HOLD IT STEADY"
          : telemetry.pressure < 88
            ? "EASE OFF"
            : "LET GO IMMEDIATELY";
  const status = phase === "running" ? liveStatus : finalStatus;

  return (
    <article
      className={[
        "micro-lab-card micro-jackhammer-card",
        isOver ? "is-over" : "",
        isSafe && phase === "running" ? "is-safe" : "",
        isApplying ? "is-applying" : "",
        phase === "won" ? "is-approved" : "",
      ].join(" ")}
    >
      <div className="micro-lab-card-heading">
        <span>03</span>
        <div>
          <p>Pressure-control trial</p>
          <h3>Jackhammer calibration</h3>
        </div>
      </div>

      <div className="micro-jackhammer-stage">
        <div className="micro-calibration-telemetry">
          <span>{Math.ceil(telemetry.timeLeft)}s remaining</span>
          <strong>{Math.round(telemetry.certification)}% certified</strong>
        </div>
        <img alt="" src={assetPath("manusingjackhammerwithdifficulty.gif")} />
        <div
          className="micro-pressure-meter"
          role="meter"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={Math.round(telemetry.pressure)}
          aria-label="Jackhammer pressure"
        >
          <span className="micro-pressure-safe-zone" />
          <span style={{ width: `${telemetry.pressure}%` }} />
        </div>
        <div
          aria-label="Permit certification progress"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={Math.round(telemetry.certification)}
          className="micro-certification-meter"
          role="progressbar"
        >
          <span style={{ width: `${telemetry.certification}%` }} />
        </div>
        <p aria-live="polite">{status}</p>
      </div>

      <div className="micro-lab-controls micro-jackhammer-controls">
        <div className="micro-game-copy">
          <p>
            {phase === "running"
              ? "Hold to build pressure · release to bleed it"
              : "Earn 100% certification before the 12-second clock expires"}
          </p>
          <span>
            Best margin:{" "}
            {bestMargin > 0 ? `${bestMargin.toFixed(1)}s` : "unpermitted"}
          </span>
        </div>
        <button
          aria-keyshortcuts="Enter Space"
          aria-pressed={phase === "running" ? isApplying : undefined}
          className="micro-lab-button micro-lab-button-primary micro-jackhammer-button"
          onBlur={stopApplying}
          onClick={() => {
            if (phase !== "running") {
              startCalibration();
            }
          }}
          onKeyDown={handlePressureKeyDown}
          onKeyUp={handlePressureKeyUp}
          onPointerCancel={stopApplying}
          onPointerDown={beginApplying}
          onPointerLeave={stopApplying}
          onPointerUp={stopApplying}
          type="button"
        >
          {phase === "running"
            ? isApplying
              ? "Applying pressure"
              : "Hold for pressure"
            : phase === "idle"
              ? "Start permit test"
              : "Run it again"}
        </button>
      </div>
    </article>
  );
}

const gearSizes = [
  { code: "S", label: "small", scale: 0.72, teeth: 12 },
  { code: "M", label: "medium", scale: 0.9, teeth: 18 },
  { code: "L", label: "large", scale: 1.08, teeth: 24 },
] as const;
const gearboxOrders = [
  [2, 0, 1],
  [1, 2, 2],
  [0, 2, 1],
  [2, 1, 0],
  [1, 0, 2],
] as const;

type GearboxPhase = "idle" | "playing" | "solved" | "failed";
type GearGuess = {
  configuration: number[];
  exact: number;
  misplaced: number;
};

function scoreGearGuess(configuration: number[], target: readonly number[]) {
  let exact = 0;
  const remainingGuess = [0, 0, 0];
  const remainingTarget = [0, 0, 0];

  configuration.forEach((gear, index) => {
    if (gear === target[index]) {
      exact += 1;
    } else {
      remainingGuess[gear] += 1;
      remainingTarget[target[index]] += 1;
    }
  });

  const misplaced = remainingGuess.reduce(
    (total, count, index) => total + Math.min(count, remainingTarget[index]),
    0,
  );

  return { exact, misplaced };
}

function Gearbox() {
  const [phase, setPhase] = useState<GearboxPhase>("idle");
  const [orderIndex, setOrderIndex] = useState(-1);
  const [configuration, setConfiguration] = useState([0, 0, 0]);
  const [history, setHistory] = useState<GearGuess[]>([]);
  const [bestSolve, setBestSolve] = useState<number | null>(null);
  const [status, setStatus] = useState(
    "A sealed work order hides one three-gear configuration. Five tests, no warranty.",
  );
  const target = gearboxOrders[Math.max(0, orderIndex)];
  const attempts = history.length;

  function startWorkOrder() {
    const nextOrder = (orderIndex + 1) % gearboxOrders.length;

    setOrderIndex(nextOrder);
    setConfiguration([0, 0, 0]);
    setHistory([]);
    setStatus(
      "Work order loaded. LOCK means right gear and axle; SWAP means right gear, wrong axle.",
    );
    setPhase("playing");
  }

  function cycleGear(index: number) {
    if (phase !== "playing") {
      return;
    }

    setConfiguration((current) =>
      current.map((gear, gearIndex) =>
        gearIndex === index ? (gear + 1) % gearSizes.length : gear,
      ),
    );
  }

  function testConfiguration() {
    if (phase !== "playing") {
      return;
    }

    const result = scoreGearGuess(configuration, target);
    const nextHistory = [
      ...history,
      { configuration: [...configuration], ...result },
    ];
    const nextAttempts = nextHistory.length;

    setHistory(nextHistory);

    if (result.exact === configuration.length) {
      setBestSolve((current) =>
        current === null ? nextAttempts : Math.min(current, nextAttempts),
      );
      setStatus(
        `MESH CERTIFIED · solved in ${nextAttempts} ${nextAttempts === 1 ? "test" : "tests"}. Suspiciously competent.`,
      );
      setPhase("solved");
    } else if (nextAttempts >= 5) {
      const answer = target.map((gear) => gearSizes[gear].code).join("–");
      setStatus(`GEARBOX UNIONIZED · the hidden order was ${answer}.`);
      setPhase("failed");
    } else {
      setStatus(
        `${result.exact} LOCK · ${result.misplaced} SWAP · ${5 - nextAttempts} tests remain.`,
      );
    }
  }

  const revealedOrder =
    phase === "solved" || phase === "failed"
      ? target.map((gear) => gearSizes[gear].code).join("–")
      : "?–?–?";

  return (
    <article
      className={[
        "micro-lab-card micro-gear-card",
        phase === "solved" ? "is-solved" : "",
        phase === "failed" ? "is-failed" : "",
      ].join(" ")}
    >
      <div className="micro-lab-card-heading">
        <span>04</span>
        <div>
          <p>Five-guess codebreaker</p>
          <h3>Central gearbox</h3>
        </div>
      </div>

      <div className="micro-gear-stage">
        <div className="micro-gear-work-order">
          <span>Hidden service order</span>
          <strong>{revealedOrder}</strong>
          <i>{attempts}/5 tests</i>
        </div>

        <div aria-label="Gear selection" className="micro-gear-selector">
          {configuration.map((gear, index) => {
            const gearSize = gearSizes[gear];

            return (
              <button
                aria-label={`Axle ${String.fromCharCode(65 + index)} has a ${gearSize.label} ${gearSize.teeth}-tooth gear. Change gear.`}
                className="micro-gear-axle"
                disabled={phase !== "playing"}
                key={index}
                onClick={() => cycleGear(index)}
                style={{ "--gear-scale": gearSize.scale } as CSSProperties}
                type="button"
              >
                <span>Axle {String.fromCharCode(65 + index)}</span>
                <img alt="" src={assetPath("gears2.gif")} />
                <strong>
                  {gearSize.code} · {gearSize.teeth}T
                </strong>
              </button>
            );
          })}
        </div>

        <div className="micro-gear-history">
          {history.length === 0 ? (
            <p>Choose S, M, or L on each axle, then test the mesh.</p>
          ) : (
            history.slice(-3).map((guess, index) => (
              <p key={`${history.length}-${index}`}>
                <span>
                  {guess.configuration
                    .map((gear) => gearSizes[gear].code)
                    .join("–")}
                </span>
                <strong>
                  {guess.exact} lock · {guess.misplaced} swap
                </strong>
              </p>
            ))
          )}
        </div>
      </div>

      <div className="micro-lab-controls micro-gear-controls">
        <div className="micro-game-copy">
          <p aria-live="polite">{status}</p>
          <span>
            Best solve: {bestSolve === null ? "sealed" : `${bestSolve}/5 tests`}
          </span>
        </div>
        <div className="micro-lab-actions">
          <button
            className="micro-lab-button"
            onClick={startWorkOrder}
            type="button"
          >
            {phase === "idle" ? "Pull work order" : "New order"}
          </button>
          <button
            className="micro-lab-button micro-lab-button-primary"
            disabled={phase !== "playing"}
            onClick={testConfiguration}
            type="button"
          >
            Test mesh
          </button>
        </div>
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
