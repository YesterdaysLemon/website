import type { Route } from "./+types/about";

import { PageShell } from "~/components/page-shell";
import { resumeData } from "~/content/resume";

const focusAreas = [
  {
    title: "Developer tools that earn trust",
    description:
      "Typed outputs, bounded automation, human gates, and evidence another engineer can inspect.",
  },
  {
    title: "Backend systems that survive contact",
    description:
      "APIs, data models, background work, and deployment paths designed around real failure modes.",
  },
  {
    title: "Reproducible interactive systems",
    description:
      "Simulations and games with deterministic state, causal controls, replay, and honest authored boundaries.",
  },
  {
    title: "Evidence-gated open research",
    description:
      "Exact finite checkpoints, independent verification, and unresolved questions that stay labeled unresolved.",
  },
] as const;

const curiosityAreas = [
  {
    title: "Mathematical structure",
    description:
      "Graph theory, combinatorics, astronomy, and patterns with teeth.",
  },
  {
    title: "Living systems",
    description:
      "Botany, connectomes, animal behavior, and simulated creatures.",
  },
  {
    title: "Games as systems",
    description:
      "Card games, board games, video games, D&D, and delightful rules.",
  },
  {
    title: "Human questions",
    description:
      "Philosophy, rationality, geopolitics, AI alignment, and safety.",
  },
] as const;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "about | alireza afshan" },
    {
      name: "description",
      content:
        "A little background on Alireza Afshan, the scenic route into software, and the systems that keep turning into side quests.",
    },
  ];
}

export default function About() {
  return (
    <PageShell
      eyebrow="About"
      intro="A little background, a few detours, and why I keep building things."
      routeId="about"
      title="Alireza Afshan"
    >
      <div className="grid gap-8 lg:grid-cols-[0.7fr_0.3fr]">
        <section className="archive-card self-start p-6 sm:p-8">
          <div className="max-w-3xl space-y-5 text-base leading-8 sm:text-lg">
            <p className="text-muted">
              Hiya! I&apos;m Alireza, a software developer with an Information
              Systems degree and a tendency to turn small ideas into full
              systems.
            </p>
            <p className="text-muted">
              This site is part portfolio, part playground, and part proof that
              I can, in fact, keep a VPS alive. The resume has the tidy version,
              Projects has the serious write-ups, and Showcase has the live
              weird little things.
            </p>
            <p className="text-muted">
              Before the software stuff, I studied astronomy and mathematics at
              the University of Arizona. Life took a fairly aggressive detour,
              including finally getting an ADHD diagnosis, so I stepped away,
              regrouped, and later restarted my degree in Doha.
            </p>
            <p className="text-muted">
              The closest fit at the University of Doha for Science and
              Technology was Information Systems, which turned out to be a good
              home for my particular mix of interests: software design,
              databases, networking, Linux, deployment, and hardware-adjacent
              projects. I finished the degree with honors in May 2026 after
              speed-running it in about three years.
            </p>
            <p className="text-muted">
              I&apos;m now based in Las Vegas and looking for junior software,
              backend, systems, developer tooling, or DevOps work. Remote is
              great, relocation is on the table, and I especially like work
              where code has to survive contact with real infrastructure, real
              users, uncertain evidence, or slightly cursed hardware.
            </p>
          </div>
        </section>

        <aside>
          <section className="archive-card p-6">
            <h2 className="font-serif text-2xl text-[var(--route-accent)]">
              Contact
            </h2>
            <div className="text-muted mt-5 space-y-4 text-sm leading-7">
              <a
                className="archive-inline-link block"
                href={`mailto:${resumeData.email}`}
              >
                {resumeData.email}
              </a>
              <a
                className="archive-inline-link block"
                href={resumeData.githubUrl}
                rel="noreferrer"
                target="_blank"
              >
                GitHub
              </a>
              <a
                className="archive-inline-link block"
                href={resumeData.linkedInUrl}
                rel="noreferrer"
                target="_blank"
              >
                LinkedIn
              </a>
            </div>
          </section>
        </aside>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.62fr_0.38fr]">
        <section className="archive-card p-6 sm:p-8">
          <p className="text-muted text-xs font-extrabold tracking-[0.22em] uppercase">
            Current focus
          </p>
          <h2 className="mt-2 font-serif text-3xl text-[var(--route-accent)]">
            Problems I like working on
          </h2>
          <p className="text-muted mt-3 max-w-2xl text-sm leading-7">
            The common thread is inspectability: systems should explain what
            they did, what they know, and where their confidence stops.
          </p>
          <div className="about-focus-list">
            {focusAreas.map((item, index) => (
              <article className="about-focus-item" key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="archive-card p-6 sm:p-8">
          <p className="text-muted text-xs font-extrabold tracking-[0.22em] uppercase">
            Off-duty inputs
          </p>
          <h2 className="mt-2 font-serif text-3xl text-[var(--route-accent)]">
            Curiosities that leak into the work
          </h2>
          <div className="about-curiosity-list">
            {curiosityAreas.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
