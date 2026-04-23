import type { Route } from "./+types/projects";
import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

import { MarkdownContent } from "~/components/markdown-content";
import { PageShell } from "~/components/page-shell";
import { getProjects } from "~/lib/content.server";

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
      title="Projects"
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.slug}
            className="group border-line bg-card hover:border-ink flex h-full flex-col rounded-[1.75rem] border p-5 transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(23,33,38,0.08)]"
            to={project.href}
          >
            {project.coverImage ? (
              <img
                alt=""
                className="border-line bg-paper mb-5 aspect-[16/10] w-full rounded-[1.25rem] border object-cover"
                src={project.coverImage}
              />
            ) : null}

            <div className="flex flex-1 flex-col">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl leading-tight">
                    {project.title}
                  </h2>
                  <p className="text-muted mt-1 text-sm">{project.year}</p>
                </div>
                {project.status ? (
                  <span className="border-line text-muted rounded-full border px-2.5 py-1 text-xs font-semibold tracking-[0.18em] uppercase">
                    {project.status}
                  </span>
                ) : null}
              </div>

              <p className="text-muted text-sm leading-7">{project.summary}</p>

              {project.tags?.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-ink/5 text-ink rounded-full px-3 py-1 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="text-accent mt-6 text-sm font-semibold">
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

          <div className="border-line bg-card relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] border shadow-[0_40px_120px_rgba(0,0,0,0.2)]">
            <div className="border-line flex items-start justify-between gap-6 border-b px-6 py-5 sm:px-8">
              <div>
                <p className="text-muted text-xs font-semibold tracking-[0.24em] uppercase">
                  {selectedProject.year}
                </p>
                <h2 className="mt-2 font-serif text-3xl leading-tight sm:text-4xl">
                  {selectedProject.title}
                </h2>
                <p className="text-muted mt-3 max-w-2xl text-sm leading-7 sm:text-base">
                  {selectedProject.summary}
                </p>
              </div>

              <Link
                className="border-line text-muted hover:border-ink hover:text-ink rounded-full border px-3 py-1.5 text-sm transition"
                to="/projects"
              >
                Close
              </Link>
            </div>

            <div className="overflow-y-auto px-6 py-6 sm:px-8">
              {selectedProject.coverImage ? (
                <img
                  alt=""
                  className="border-line bg-paper mb-6 aspect-[16/9] w-full rounded-[1.5rem] border object-cover"
                  src={selectedProject.coverImage}
                />
              ) : null}

              {selectedProject.repoUrl || selectedProject.liveUrl ? (
                <div className="mb-6 flex flex-wrap gap-3">
                  {selectedProject.repoUrl ? (
                    <a
                      className="border-ink hover:bg-ink hover:text-paper rounded-full border px-4 py-2 text-sm font-semibold transition"
                      href={selectedProject.repoUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Repository
                    </a>
                  ) : null}
                  {selectedProject.liveUrl ? (
                    <a
                      className="border-line text-muted hover:border-ink hover:text-ink rounded-full border px-4 py-2 text-sm font-semibold transition"
                      href={selectedProject.liveUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Live link
                    </a>
                  ) : null}
                </div>
              ) : null}

              <MarkdownContent>{selectedProject.body}</MarkdownContent>
            </div>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
