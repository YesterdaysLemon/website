import type { Route } from "./+types/resume";

import { PageShell } from "~/components/page-shell";
import { resumeData } from "~/content/resume";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "resume | alireza afshan" },
    {
      name: "description",
      content: "Experience, education, skills, and PDF resume.",
    },
  ];
}

export default function Resume() {
  return (
    <PageShell
      eyebrow="Resume"
      intro="The web version is the primary view here. The PDF is still available if you prefer the one-page format."
      title={resumeData.name}
    >
      <div className="grid gap-8 lg:grid-cols-[0.72fr_0.28fr]">
        <section className="space-y-8">
          <div className="border-line bg-card rounded-[1.75rem] border p-6 sm:p-8">
            <p className="text-muted text-xs font-semibold tracking-[0.28em] uppercase">
              {resumeData.role}
            </p>
            <p className="text-muted mt-4 max-w-3xl text-base leading-8 sm:text-lg">
              {resumeData.summary}
            </p>
          </div>

          <section className="border-line bg-card rounded-[1.75rem] border p-6 sm:p-8">
            <h2 className="font-serif text-3xl">Experience</h2>
            <div className="mt-6 space-y-8">
              {resumeData.experience.map((role) => (
                <article
                  key={`${role.organization}-${role.start}`}
                  className="border-line border-t pt-6 first:border-t-0 first:pt-0"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-ink text-xl font-semibold">
                        {role.title}
                      </h3>
                      <p className="text-muted mt-1 text-sm">
                        {role.organization}
                        {role.location ? ` · ${role.location}` : ""}
                      </p>
                    </div>
                    <p className="text-muted text-sm">
                      {role.start} - {role.end}
                    </p>
                  </div>
                  <p className="text-muted mt-4 text-sm leading-7 sm:text-base">
                    {role.summary}
                  </p>
                  <ul className="text-muted mt-4 space-y-2 text-sm leading-7 sm:text-base">
                    {role.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-3">
                        <span className="bg-ink mt-3 h-1.5 w-1.5 rounded-full" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="border-line bg-card rounded-[1.75rem] border p-6 sm:p-8">
            <h2 className="font-serif text-3xl">Education</h2>
            <div className="mt-6 space-y-8">
              {resumeData.education.map((item) => (
                <article
                  key={`${item.institution}-${item.start}`}
                  className="border-line border-t pt-6 first:border-t-0 first:pt-0"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-ink text-xl font-semibold">
                        {item.institution}
                      </h3>
                      <p className="text-muted mt-1 text-sm">
                        {item.degree}
                        {item.location ? ` · ${item.location}` : ""}
                      </p>
                    </div>
                    <p className="text-muted text-sm">
                      {item.start} - {item.end}
                    </p>
                  </div>
                  <ul className="text-muted mt-4 space-y-2 text-sm leading-7 sm:text-base">
                    {item.notes.map((note) => (
                      <li key={note} className="flex gap-3">
                        <span className="bg-ink mt-3 h-1.5 w-1.5 rounded-full" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="border-line bg-card rounded-[1.75rem] border p-6 sm:p-8">
            <div className="flex flex-col gap-8 xl:grid xl:grid-cols-3">
              <div>
                <h2 className="font-serif text-3xl">Skills</h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 xl:col-span-2">
                <div>
                  <h3 className="text-muted text-sm font-semibold tracking-[0.18em] uppercase">
                    Technical
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {resumeData.skills.technical.map((skill) => (
                      <span
                        key={skill}
                        className="bg-ink/5 text-ink rounded-full px-3 py-1 text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-muted text-sm font-semibold tracking-[0.18em] uppercase">
                    Languages
                  </h3>
                  <ul className="text-muted mt-4 space-y-2 text-sm leading-7">
                    {resumeData.skills.languages.map((language) => (
                      <li key={language}>{language}</li>
                    ))}
                  </ul>
                </div>

                <div className="sm:col-span-2">
                  <h3 className="text-muted text-sm font-semibold tracking-[0.18em] uppercase">
                    Additional
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {resumeData.skills.additional.map((skill) => (
                      <span
                        key={skill}
                        className="bg-ink/5 text-ink rounded-full px-3 py-1 text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border-line bg-card rounded-[1.75rem] border p-6 sm:p-8">
            <h2 className="font-serif text-3xl">PDF Version</h2>
            <p className="text-muted mt-4 max-w-2xl text-sm leading-7 sm:text-base">
              The PDF remains the downloadable version if you need the original
              one-page format.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                className="border-ink hover:bg-ink hover:text-paper rounded-full border px-4 py-2 text-sm font-semibold transition"
                href={resumeData.pdfPath}
                rel="noreferrer"
                target="_blank"
              >
                Open PDF
              </a>
              <a
                className="border-line text-muted hover:border-ink hover:text-ink rounded-full border px-4 py-2 text-sm font-semibold transition"
                download
                href={resumeData.pdfPath}
              >
                Download PDF
              </a>
            </div>
            <div className="border-line bg-paper mt-6 overflow-hidden rounded-[1.5rem] border">
              <iframe
                className="h-[72vh] w-full"
                src={resumeData.pdfPath}
                title="Alireza Afshan resume PDF"
              />
            </div>
          </section>
        </section>

        <aside className="space-y-6">
          <section className="border-line bg-card rounded-[1.75rem] border p-6">
            <h2 className="font-serif text-2xl">Contact</h2>
            <div className="text-muted mt-5 space-y-4 text-sm leading-7">
              <p>{resumeData.location}</p>
              <a
                className="text-accent decoration-accent/40 block underline underline-offset-4"
                href={`mailto:${resumeData.email}`}
              >
                {resumeData.email}
              </a>
              <p>{resumeData.phone}</p>
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
            <h2 className="font-serif text-2xl">Certifications</h2>
            <div className="mt-5 space-y-4">
              {resumeData.certifications.map((item) => (
                <article key={item.title}>
                  <h3 className="text-ink text-base font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-muted text-sm leading-7">
                    {item.issuer}
                    <br />
                    {item.date}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </PageShell>
  );
}
