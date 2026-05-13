import type { Route } from "./+types/about";

import { PageShell } from "~/components/page-shell";
import { resumeData } from "~/content/resume";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "about | alireza afshan" },
    {
      name: "description",
      content:
        "About Alireza Afshan, a software and systems engineer working across applications, delivery, and information systems.",
    },
  ];
}

export default function About() {
  return (
    <PageShell
      eyebrow="About"
      intro="A short profile for the person behind the projects, notes, and systems work."
      title="Alireza Afshan"
    >
      <div className="grid gap-8 lg:grid-cols-[0.7fr_0.3fr]">
        <section className="border-line bg-card rounded-[1.75rem] border p-6 sm:p-8">
          <div className="max-w-3xl space-y-5 text-base leading-8 sm:text-lg">
            <p className="text-muted">
              I work across software, delivery, and information systems, with a
              focus on building useful products and understanding the operational
              details that keep them reliable.
            </p>
            <p className="text-muted">
              My current interests include mobile application work, cloud-backed
              systems, delivery pipelines, and the practical side of taking an
              idea from implementation to something people can use.
            </p>
            <p className="text-muted">Based in Doha, Qatar.</p>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="border-line bg-card rounded-[1.75rem] border p-6">
            <h2 className="font-serif text-2xl">Contact</h2>
            <div className="text-muted mt-5 space-y-4 text-sm leading-7">
              <a
                className="text-accent decoration-accent/40 block underline underline-offset-4"
                href={`mailto:${resumeData.email}`}
              >
                {resumeData.email}
              </a>
              <a
                className="text-accent decoration-accent/40 block underline underline-offset-4"
                href={resumeData.githubUrl}
                rel="noreferrer"
                target="_blank"
              >
                GitHub
              </a>
            </div>
          </section>

          <section className="border-line bg-card rounded-[1.75rem] border p-6">
            <h2 className="font-serif text-2xl">Focus</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                "Application development",
                "Delivery pipelines",
                "Cloud-backed systems",
                "Information systems",
              ].map((item) => (
                <span
                  key={item}
                  className="bg-ink/5 text-ink rounded-full px-3 py-1 text-sm"
                >
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
