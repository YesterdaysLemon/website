import type { Route } from "./+types/about";

import { Link } from "react-router";

import { PageShell } from "~/components/page-shell";
import { resumeData } from "~/content/resume";

const focusAreas = [
  {
    title: "Developer tools",
    description:
      "Small systems that make complicated work easier to inspect and harder to fake.",
  },
  {
    title: "Backend & infrastructure",
    description:
      "APIs, databases, background jobs, Linux, and the strange failures between them.",
  },
  {
    title: "Simulations & games",
    description:
      "Interactive systems where the rules, state, and feedback all matter.",
  },
  {
    title: "Open-ended research",
    description:
      "Hard questions, finite checkpoints, and bright labels on whatever is still unknown.",
  },
] as const;

const curiosityAreas = [
  {
    title: "Mathematics & systems",
    description:
      "Rules, models, patterns, and whatever makes the whole thing move.",
    items: [
      "Graph theory",
      "Combinatorics",
      "Astronomy",
      "Computing",
      "Simulations",
      "Logic",
      "Algebra",
      "Physics",
      "Probability",
      "Hardware",
      "Emergence",
      "Complexity",
      "Dynamics",
    ],
  },
  {
    title: "Living systems",
    description:
      "Birds, bugs, brains, plants, and systems that organize themselves.",
    items: [
      "Botany",
      "Connectomes",
      "Ethology",
      "Digital life",
      "Birds",
      "Cognition",
      "Swarms",
      "Insects",
      "Evolution",
      "Ecology",
      "Microbes",
      "Ecosystems",
      "Bonsai",
    ],
  },
  {
    title: "Making & games",
    description:
      "Playing things, making things, and learning the tool a little too well.",
    items: [
      "Blackjack",
      "Board games",
      "Video games",
      "D&D",
      "Music",
      "Ukulele",
      "Guitar",
      "Sculpture",
      "Minecraft",
      "WorldEdit",
      "Drawing",
      "Menswear",
      "Custom keyboards",
    ],
  },
  {
    title: "Human questions",
    description:
      "Questions that start technical and end up being about people.",
    items: [
      "Philosophy",
      "Rationality",
      "Geopolitics",
      "AI alignment",
      "AI safety",
      "Language",
      "Consciousness",
      "Sociology",
      "Epistemology",
      "Ontology",
      "Identity",
      "Futurism",
      "Ideology",
    ],
  },
] as const;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "about | alireza afshan" },
    {
      name: "description",
      content:
        "A little background on Alireza Afshan, the route into software, and the interests that keep turning into projects.",
    },
  ];
}

export default function About() {
  return (
    <PageShell
      eyebrow="About"
      intro="The slightly crooked route here, the systems I like making, and the rabbit holes that keep becoming repositories."
      routeId="about"
      title="Alireza Afshan"
    >
      <div className="grid gap-8 lg:grid-cols-[0.7fr_0.3fr]">
        <section className="archive-card order-2 self-start p-6 sm:p-8 lg:order-1">
          <div className="max-w-3xl space-y-5 text-base leading-8 sm:text-lg">
            <p className="text-muted">
              Hiya! I&apos;m Alireza, a software developer with a habit of
              letting small questions turn into entire systems.
            </p>
            <p className="text-muted">
              I started out studying astronomy and mathematics at the University
              of Arizona. Life got messy, I stepped away, eventually got an ADHD
              diagnosis, and later started again in Doha.
            </p>
            <p className="text-muted">
              Information Systems at UDST ended up being a surprisingly good
              fit: software design, databases, networking, Linux, deployment,
              and the occasional hardware problem. I graduated with honors in
              May 2026 after squeezing the degree into about three years.
            </p>
            <p className="text-muted">
              Now I&apos;m in Las Vegas. I like jobs where I can follow a
              problem from the code to the machine it runs on, especially when
              some slightly cursed hardware is involved.
            </p>
          </div>
        </section>

        <aside className="order-1 lg:order-2">
          <section className="archive-card p-6">
            <h2 className="font-serif text-2xl text-[var(--route-accent)]">
              Right now
            </h2>
            <div className="text-muted mt-5 space-y-3 text-sm leading-7">
              <p className="font-semibold text-[var(--ink)]">
                Las Vegas, Nevada
              </p>
              <p>
                Looking for a junior role where backend, systems, tooling, or
                slightly cursed hardware overlap.
              </p>
              <p>Open to remote work or relocation.</p>
              <div className="mt-5 space-y-3 border-t border-[var(--line)] pt-4">
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
            </div>
          </section>
        </aside>
      </div>

      <div className="mt-8 space-y-8">
        <section className="archive-card p-6 sm:p-8">
          <h2 className="font-serif text-3xl text-[var(--route-accent)]">
            What I like working on
          </h2>
          <p className="text-muted mt-3 max-w-2xl text-sm leading-7">
            Usually some mix of tools, infrastructure, simulation, and wanting
            to know what the system is actually doing.
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

        <section className="archive-card p-6 sm:p-8" id="curiosities">
          <div className="about-curiosity-heading">
            <div>
              <h2 className="font-serif text-3xl text-[var(--route-accent)]">
                Things I keep coming back to
              </h2>
              <p className="text-muted mt-3 max-w-2xl text-sm leading-7">
                Some become projects. Some just eat an afternoon.
              </p>
            </div>

            <Link className="interest-deck-link" to="/about-blackjack-lab.html">
              <span className="interest-deck-suits" aria-hidden="true">
                <span>♣</span>
                <span>♥</span>
                <span>♦</span>
                <span>♠</span>
              </span>
              <span>
                <small>52 interests · one deck</small>
                <strong>Play interest blackjack</strong>
              </span>
              <span className="interest-deck-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          </div>
          <div className="about-curiosity-list">
            {curiosityAreas.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <ul
                  aria-label={`${item.title} interests`}
                  className="poker-chip-list about-chip-list"
                >
                  {item.items.map((interest) => (
                    <li className="poker-chip" key={interest}>
                      {interest}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
