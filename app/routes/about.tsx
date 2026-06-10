import type { Route } from "./+types/about";

import { PageShell } from "~/components/page-shell";
import { resumeData } from "~/content/resume";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "about | alireza afshan" },
    {
      name: "description",
      content:
        "About Alireza Afshan, who barfs up their life story in a desperate attempt to get a job in software engineering.",
    },
  ];
}

export default function About() {
  return (
    <PageShell
      eyebrow="About"
      intro="It all began when I was a young..."
      routeId="about"
      title="Alireza Afshan"
    >
      <div className="grid gap-8 lg:grid-cols-[0.7fr_0.3fr]">
        <section className="archive-card p-6 sm:p-8">
          <div className="max-w-3xl space-y-5 text-base leading-8 sm:text-lg">
            <p className="text-muted">Hiya!</p>
            <p className="text-muted">
              This is my a place where I can share a little bit about myself for
              others but also a place where I can write some of my own ideas and
              thoughts down. You can check out my resume page for details about
              my employability generally, (if thats you're kinda thing), but you
              can check my projects page and blog for things that I've worked on
              or am working one currently.
            </p>
            <p className="text-muted">
              This website is also an exercise in building a personal website, blog, 
              hosting, and doing all that from scratch. I gotta put my computer science
              degree to use somehow.
            </p>
            <p className="text-muted">
              Before comp-sci stuff I was a student at the University of Arizona, where
              I did some astronomy before switching to mathematics. Life got in the way 
              (turns out undiagnosed ADHD shows up at around this time in life for a lot of people), so I 
              couldn't finish the either degree. So I had to leave the country for a while and figure out what was
              destroying my life and fix it pronto.
              </p>
            <p className="text-muted">
              I basically had to restart university from scratch,
              so I went to the University of Doha for Science and Technology, where the only degree kinda 
              even remotely similar to what I was doing before was information systems in their college
              of computing. 
              </p>
            <p className="text-muted">
              It was a fine program. I learned a lot, especially in the systems design
              and software design space. I ended up speed running in about 3 years, which was easy
              because I have a general aptitude for learning and technical stuff (and stimulants help a lot too).
              I graduated in 2026 with a bachelor's degree in information systems, and now I'm making my way back to the states
              and trying to get a job in the software engineering space.
            </p>
            <p className="text-muted">
              Based in Las Vegas, Nevada as of June 2026, but I'm open to remote work and opportunities in other locations as well.
              (PLEASE SOME SF BAY AREA JOBS HIRE ME REMOTE I'M DESPERATE BUT I'M CRACKED I PROMISE.)
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
                "Not thinking enough"
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
