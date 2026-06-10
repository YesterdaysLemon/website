import type { Route } from "./+types/resume";

import { PageShell } from "~/components/page-shell";
import { resumeData } from "~/content/resume";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "resume | alireza afshan" },
    {
      name: "description",
      content:
        "Experience, education, skills, certifications, and contact links.",
    },
  ];
}

export default function Resume() {
  return (
    <PageShell
      eyebrow="Resume"
      intro="Basically my resume, but on the internet and with more words and details."
      routeId="resume"
      title={resumeData.name}
    >
      <div className="grid gap-8 lg:grid-cols-[0.72fr_0.28fr]">
        <section className="space-y-8">
          <div className="archive-card p-6 sm:p-8">
            <p className="text-muted text-xs font-semibold tracking-[0.28em] uppercase">
              {resumeData.role}
            </p>
            <p className="text-muted mt-4 max-w-3xl text-base leading-8 sm:text-lg">
              {resumeData.summary}
            </p>
          </div>

          <section className="archive-card p-6 sm:p-8">
            <h2 className="font-serif text-3xl text-[var(--route-accent)]">
              Experience
            </h2>
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
                        {role.location ? ` - ${role.location}` : ""}
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
                        <span className="mt-3 h-1.5 w-1.5 rounded-full bg-[var(--route-accent)]" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="archive-card p-6 sm:p-8">
            <h2 className="font-serif text-3xl text-[var(--route-accent)]">
              Education
            </h2>
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
                        {item.location ? ` - ${item.location}` : ""}
                      </p>
                    </div>
                    <p className="text-muted text-sm">
                      {item.start} - {item.end}
                    </p>
                  </div>
                  {item.summary ? (
                    <p className="text-muted mt-4 text-sm leading-7 sm:text-base">
                      {item.summary}
                    </p>
                  ) : null}
                  <ul className="text-muted mt-4 space-y-2 text-sm leading-7 sm:text-base">
                    {item.notes.map((note) => (
                      <li key={note} className="flex gap-3">
                        <span className="mt-3 h-1.5 w-1.5 rounded-full bg-[var(--route-accent)]" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="archive-card p-6 sm:p-8">
            <div className="flex flex-col gap-8 xl:grid xl:grid-cols-3">
              <div>
                <h2 className="font-serif text-3xl text-[var(--route-accent)]">
                  Skills
                </h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 xl:col-span-2">
                {resumeData.skills.map((group) => (
                  <div key={group.label}>
                    <h3 className="text-muted text-sm font-semibold tracking-[0.18em] uppercase">
                      {group.label}
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {group.details.map((skill) => (
                        <span key={skill} className="archive-tag text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </section>

        <aside className="space-y-6">
          <section className="archive-card p-6">
            <h2 className="font-serif text-2xl text-[var(--route-accent)]">
              Contact
            </h2>
            <div className="text-muted mt-5 space-y-4 text-sm leading-7">
              <p>{resumeData.location}</p>
              <a
                className="archive-inline-link block"
                href={`mailto:${resumeData.email}`}
              >
                {resumeData.email}
              </a>
              <a
                className="archive-inline-link block"
                href={resumeData.websiteUrl}
                rel="noreferrer"
                target="_blank"
              >
                Website
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
              Certifications
            </h2>
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
