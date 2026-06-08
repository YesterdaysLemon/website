import type { Route } from "./+types/projects";
import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

import { MarkdownContent } from "~/components/markdown-content";
import { PageShell } from "~/components/page-shell";
import { getProjects } from "~/lib/content.server";
import { getArchiveMarker } from "~/lib/route-design";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "projects | alireza afshan" },
    {
      name: "description",
      content: "Selected work spanning applications, systems, and delivery.",
    },
  ];
}

export async function loader() {
  return {
    projects: await getProjects(),
  };
}

export default function Projects({ loaderData }: Route.ComponentProps) {
  const { projects } = loaderData;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedSlug = searchParams.get("project");
  const selectedProject =
    projects.find((project) => project.slug === selectedSlug) ?? null;

  useEffect(() => {
    if (!selectedProject) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        navigate("/projects");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate, selectedProject]);

  return (
    <PageShell
      eyebrow="Selected work"
      intro="A few projects pulled from markdown files. The goal is not to list everything, only the work that says something useful."
      routeId="projects"
      title="Projects"
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => (
          <Link
            key={project.slug}
            className="archive-card archive-card-link group flex h-full flex-col p-5"
            to={project.href}
          >
            {project.coverImage ? (
              <img
                alt=""
                className="project-cover-image mb-5 aspect-[16/10] w-full object-contain p-3"
                src={project.coverImage}
              />
            ) : null}

            <div className="flex flex-1 flex-col">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="font-serif text-2xl leading-tight text-[var(--route-accent)]">
                    {project.title}
                  </h2>
                  <p className="text-muted mt-1 text-sm">{project.year}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="archive-marker text-xl">
                    {getArchiveMarker("projects", index)}
                  </span>
                  {project.status ? (
                    <span className="archive-tag max-w-[7.5rem] text-right text-[0.68rem] tracking-[0.14em] uppercase">
                      {project.status}
                    </span>
                  ) : null}
                </div>
              </div>

              <p className="text-muted text-sm leading-7">{project.summary}</p>

              {project.tags?.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="archive-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="archive-inline-link mt-6 w-fit text-sm font-bold">
                Open notes
              </div>
            </div>
          </Link>
        ))}
      </div>

      {selectedProject ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          role="dialog"
        >
          <Link
            aria-label="Close project details"
            className="bg-ink/55 absolute inset-0 backdrop-blur-sm"
            to="/projects"
          />

          <div className="border-line bg-warm-card relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[var(--radius)] border shadow-[0_40px_120px_rgba(0,0,0,0.2)]">
            <div className="border-line flex items-start justify-between gap-6 border-b px-6 py-5 sm:px-8">
              <div>
                <p className="text-muted text-xs font-semibold tracking-[0.24em] uppercase">
                  {selectedProject.year}
                </p>
                <h2 className="mt-2 font-serif text-3xl leading-tight text-[var(--route-accent)] sm:text-4xl">
                  {selectedProject.title}
                </h2>
                <p className="text-muted mt-3 max-w-2xl text-sm leading-7 sm:text-base">
                  {selectedProject.summary}
                </p>
              </div>

              <Link
                className="archive-button archive-button-secondary"
                to="/projects"
              >
                Close
              </Link>
            </div>

            <div className="overflow-y-auto px-6 py-6 sm:px-8">
              {selectedProject.coverImage ? (
                <img
                  alt=""
                  className="project-cover-image mb-6 aspect-[16/9] max-h-[42vh] w-full object-contain p-4"
                  src={selectedProject.coverImage}
                />
              ) : null}

              {selectedProject.repoUrl || selectedProject.liveUrl ? (
                <div className="mb-6 flex flex-wrap gap-3">
                  {selectedProject.repoUrl ? (
                    <a
                      className="archive-button archive-button-primary"
                      href={selectedProject.repoUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Repository
                    </a>
                  ) : null}
                  {selectedProject.liveUrl ? (
                    <a
                      className="archive-button archive-button-secondary"
                      href={selectedProject.liveUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Live link
                    </a>
                  ) : null}
                </div>
              ) : null}

              <section className="project-personal-notes-panel mb-6">
                <h3 className="project-section-label">Personal notes</h3>
                {selectedProject.personalNotes ? (
                  <MarkdownContent>
                    {selectedProject.personalNotes}
                  </MarkdownContent>
                ) : (
                  <p className="text-muted text-sm leading-7 italic sm:text-base">
                    Personal notes are not written yet. I&apos;ll add my own
                    reflections here later.
                  </p>
                )}
              </section>

              {selectedProject.aiSummary ? (
                <section className="project-ai-summary-panel">
                  <div className="project-ai-summary-label">
                    <span className="project-ai-summary-badge">01</span>
                    AI-generated summary
                  </div>
                  <MarkdownContent>{selectedProject.aiSummary}</MarkdownContent>
                </section>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
