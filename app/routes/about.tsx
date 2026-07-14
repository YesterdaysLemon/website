import type { Route } from "./+types/about";

import { PageShell } from "~/components/page-shell";
import { resumeData } from "~/content/resume";

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
        <section className="archive-card p-6 sm:p-8">
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
              backend, systems, or DevOps work. Remote is great, relocation is
              on the table, and I especially like work where code has to survive
              contact with real infrastructure, real users, or slightly cursed
              hardware.
            </p>
          </div>
        </section>

        <aside className="space-y-6">
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

          <section className="archive-card p-6">
            <h2 className="font-serif text-2xl text-[var(--route-accent)]">
              Interests
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                "Information Systems",
                "Software Engineering",
                "Systems Design",
                "Mathematics",
                "Philosophy",
                "Astronomy",
                "Botany",
                "Music",
                "Geopolitical Strategy",
                "Card Games",
                "Board Games",
                "Video Games",
                "D&D",
                "AI Alignment",
                "AI Safety",
                "Rationality",
                "Thinking too much",
                "Not thinking enough",
              ].map((item) => (
                <span key={item} className="archive-tag text-sm">
                  {item}
                </span>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </PageShell>
  );
}
