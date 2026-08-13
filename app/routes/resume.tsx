import type { Route } from "./+types/resume";

import { PageShell } from "~/components/page-shell";
import { TactilePill } from "~/components/tactile-pill";
import { resumeData } from "~/content/resume";
import { archiveSuits, getArchiveSuit } from "~/lib/route-design";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "resume | alireza afshan" },
    {
      name: "description",
      content:
        "Backend, systems, developer tooling, research software, infrastructure, and contact links.",
    },
  ];
}

export default function Resume() {
  return (
    <PageShell
      eyebrow="Resume"
      intro="The reasonably tidy version of what I have built, verified, learned, and been trusted with so far."
      routeId="resume"
      title={resumeData.name}
    >
      <div className="grid gap-8 lg:grid-cols-[0.72fr_0.28fr]">
        <section className="space-y-8">
          <div className="suit-watermark-card suit-card suit-scope suit-spade archive-card p-6 sm:p-8">
            <p className="suit-title text-muted text-xs font-semibold tracking-[0.28em] uppercase">
              {resumeData.role}
            </p>
            <p className="text-muted mt-4 max-w-3xl text-base leading-8 sm:text-lg">
              {resumeData.summary}
            </p>
          </div>

          <section className="suit-watermark-card suit-scope suit-heart archive-card p-6 sm:p-8">
            <h2 className="font-serif text-3xl text-[var(--route-accent)]">
              Experience
            </h2>
            <div className="mt-6 space-y-8">
              {resumeData.experience.map((role, index) => {
                const suit = getArchiveSuit(index);

                return (
                  <article
                    key={`${role.organization}-${role.start}`}
                    className={`resume-entry suit-row suit-scope suit-${suit.name} border-line border-t pt-6 first:border-t-0 first:pt-0`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="suit-title text-ink text-xl font-semibold">
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
                          <span className="suit-dot mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--route-accent)]" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="suit-watermark-card suit-scope suit-diamond archive-card p-6 sm:p-8">
            <h2 className="font-serif text-3xl text-[var(--route-accent)]">
              Education
            </h2>
            <div className="mt-6 space-y-8">
              {resumeData.education.map((item, index) => {
                const suit = getArchiveSuit(index, 2);

                return (
                  <article
                    key={`${item.institution}-${item.start}`}
                    className={`resume-entry suit-row suit-scope suit-${suit.name} border-line border-t pt-6 first:border-t-0 first:pt-0`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="suit-title text-ink text-xl font-semibold">
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
                          <span className="suit-dot mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--route-accent)]" />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="suit-watermark-card suit-scope suit-club archive-card p-6 sm:p-8">
            <div className="max-w-3xl">
              <h2 className="font-serif text-3xl text-[var(--route-accent)]">
                Tools I actually use
              </h2>
              <p className="text-muted mt-3 text-sm leading-7 sm:text-base">
                Most of these show up in the projects above. The rest come from
                school, internships, or keeping my own little corner of the
                internet alive.
              </p>
            </div>

            <div className="capability-grid">
              {resumeData.skills.map((group, index) => {
                const suit = archiveSuits[index % archiveSuits.length];

                return (
                  <article
                    className={`capability-ledger-row suit-${suit.name}`}
                    key={group.label}
                  >
                    <div aria-hidden="true" className="capability-suit-rail">
                      {suit.symbol}
                    </div>
                    <div className="capability-ledger-copy">
                      <h3>{group.label}</h3>
                      <p>{group.summary}</p>
                    </div>
                    <ul
                      aria-label={`${group.label} tools and technologies`}
                      className="capability-token-list"
                    >
                      {group.details.map((skill) => (
                        <li key={skill}>
                          <TactilePill
                            className="capability-token"
                            suit={suit.name}
                          >
                            {skill}
                          </TactilePill>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </section>
        </section>

        <aside className="space-y-6">
          <section className="suit-watermark-card suit-card suit-scope suit-club archive-card p-6">
            <h2 className="suit-title font-serif text-2xl text-[var(--route-accent)]">
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

          <section className="suit-watermark-card suit-card suit-scope suit-diamond archive-card p-6">
            <h2 className="suit-title font-serif text-2xl text-[var(--route-accent)]">
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
