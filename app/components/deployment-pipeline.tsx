import { useEffect, useState } from "react";

const deploymentSteps = [
  {
    code: "git push",
    detail: "A repository asks for a deploy.",
    title: "GitHub Actions",
  },
  {
    code: "HMAC",
    detail: "The request proves who sent it.",
    title: "Signed webhook",
  },
  {
    code: "allowlist",
    detail: "The manager finds root-owned app config.",
    title: "Deploy manager",
  },
  {
    code: "docker build",
    detail: "A new image starts on a temporary port.",
    title: "Candidate container",
  },
  {
    code: "GET /health",
    detail: "The candidate must answer before promotion.",
    title: "Health gate",
  },
  {
    code: "swap",
    detail: "Only healthy code receives production traffic.",
    title: "Promote",
  },
] as const;

type PipelinePhase = "idle" | "running" | "complete";

export function DeploymentPipeline() {
  const [activeStep, setActiveStep] = useState(0);
  const [phase, setPhase] = useState<PipelinePhase>("idle");

  useEffect(() => {
    if (phase !== "running") {
      return;
    }

    const stepTimer = window.setTimeout(() => {
      if (activeStep === deploymentSteps.length - 1) {
        setPhase("complete");
        return;
      }

      setActiveStep((current) => current + 1);
    }, 620);

    return () => window.clearTimeout(stepTimer);
  }, [activeStep, phase]);

  function runDeployment() {
    setActiveStep(0);
    setPhase("running");
  }

  const statusMessage =
    phase === "running"
      ? `${deploymentSteps[activeStep].title} is working…`
      : phase === "complete"
        ? "Healthy candidate promoted. The old container may clock out."
        : "Production stays on the current container until every gate passes.";

  return (
    <section
      aria-labelledby="deployment-architecture-title"
      className="deployment-architecture"
    >
      <div className="deployment-architecture-heading">
        <div>
          <p>Interactive architecture / safe rollout path</p>
          <h3 id="deployment-architecture-title">
            How a deploy earns production
          </h3>
        </div>
        <button
          className="deployment-run-button"
          disabled={phase === "running"}
          onClick={runDeployment}
          type="button"
        >
          {phase === "running"
            ? "Deploying…"
            : phase === "complete"
              ? "Run it again"
              : "Run pretend deploy"}
        </button>
      </div>

      <div className="deployment-current-lane">
        <span className="deployment-live-light" aria-hidden="true" />
        <div>
          <p>Current traffic lane</p>
          <strong>Caddy → production container</strong>
        </div>
        <small>Stays online during the build</small>
      </div>

      <ol className="deployment-step-list">
        {deploymentSteps.map((step, index) => {
          const isActive = phase === "running" && index === activeStep;
          const isComplete =
            phase === "complete" || (phase === "running" && index < activeStep);

          return (
            <li
              className={[
                "deployment-step",
                isActive ? "is-active" : "",
                isComplete ? "is-complete" : "",
              ].join(" ")}
              key={step.title}
            >
              <span className="deployment-step-number">
                {isComplete ? "✓" : String(index + 1).padStart(2, "0")}
              </span>
              <code>{step.code}</code>
              <strong>{step.title}</strong>
              <p>{step.detail}</p>
            </li>
          );
        })}
      </ol>

      <div
        aria-live="polite"
        className={`deployment-status is-${phase}`}
        role="status"
      >
        <span aria-hidden="true" />
        {statusMessage}
      </div>
    </section>
  );
}
