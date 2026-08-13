import type { Route } from "./+types/projects";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

import { DeploymentPipeline } from "~/components/deployment-pipeline";
import { MarkdownContent } from "~/components/markdown-content";
import { PageShell } from "~/components/page-shell";
import { TactilePill } from "~/components/tactile-pill";
import { getProjects, type ProjectEntry } from "~/lib/content.server";
import { getArchiveMarker, getArchiveSuit } from "~/lib/route-design";

type ProjectView = "all" | "live" | "open" | "private" | "research";

const projectViews: { id: ProjectView; label: string }[] = [
  { id: "all", label: "All" },
  { id: "live", label: "Live" },
  { id: "open", label: "Open source" },
  { id: "private", label: "Private" },
  { id: "research", label: "Research" },
];

const researchProjectSlugs = new Set([
  "open-mathematics-lab",
  "wurmkickflip",
  "celegans-sim",
  "puffer-drone",
  "market-research-evidence-factory",
]);

function matchesProjectView(project: ProjectEntry, view: ProjectView) {
  switch (view) {
    case "live":
      return Boolean(project.liveUrl);
    case "open":
      return Boolean(project.repoUrl);
    case "private":
      return project.status?.toLowerCase().includes("private") ?? false;
    case "research":
      return researchProjectSlugs.has(project.slug);
    default:
      return true;
  }
}

function getProjectKind(project: ProjectEntry) {
  if (project.liveUrl) return "Live site";
  if (researchProjectSlugs.has(project.slug)) return "Research file";
  if (project.repoUrl) return "Open repository";
  if (project.status?.toLowerCase().includes("private")) return "Private build";
  return "Project file";
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "projects | alireza afshan" },
    {
      name: "description",
      content:
        "Public developer tools, secure AI workflows, full-stack apps, deployment infrastructure, and a few experiments that got slightly out of hand.",
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
  const [projectView, setProjectView] = useState<ProjectView>("all");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedSlug = searchParams.get("project");
  const selectedProject =
    projects.find((project) => project.slug === selectedSlug) ?? null;
  const selectedProjectIndex = selectedProject
    ? projects.findIndex((project) => project.slug === selectedProject.slug)
    : -1;
  const selectedSuit = getArchiveSuit(Math.max(selectedProjectIndex, 0), 3);
  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => matchesProjectView(project, projectView)),
    [projectView, projects],
  );

  useEffect(() => {
    if (!selectedProject) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        navigate("/projects");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [navigate, selectedProject]);

  return (
    <PageShell
      eyebrow="Selected work"
      intro="Tools, products, simulations, infrastructure, and evidence-gated research—with the honest limits left in."
      routeId="projects"
      title="Projects"
    >
      <section
        className="suit-watermark-card suit-card suit-scope suit-spade archive-card project-index-toolbar mb-6 p-5"
        aria-labelledby="project-index-title"
      >
        <div className="project-index-copy">
          <p className="text-muted text-xs font-extrabold tracking-[0.22em] uppercase">
            August 2026 refresh
          </p>
          <h2 className="sr-only" id="project-index-title">
            Filter the project index
          </h2>
          <p className="text-ink mt-2 max-w-2xl text-sm leading-7 sm:text-base">
            {projects.length} selected projects, filed by what you can actually
            inspect.
          </p>
        </div>

        <div className="project-filter-wrap">
          <div
            aria-label="Filter projects"
            className="project-filter-list"
            role="group"
          >
            {projectViews.map((view, index) => {
              const count = projects.filter((project) =>
                matchesProjectView(project, view.id),
              ).length;
              const suit = getArchiveSuit(index, 3);

              return (
                <TactilePill
                  className="project-filter-button suit-scope"
                  key={view.id}
                  onPressedChange={(pressed) =>
                    setProjectView(pressed ? view.id : "all")
                  }
                  pressed={projectView === view.id}
                  suit={suit.name}
                >
                  {view.label}
                  <span
                    aria-hidden="true"
                    className="project-filter-chip-count"
                  >
                    {count}
                  </span>
                </TactilePill>
              );
            })}
          </div>
          <p aria-live="polite" className="project-filter-count">
            Showing {filteredProjects.length} of {projects.length}
          </p>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.map((project) => {
          const projectIndex = projects.findIndex(
            (entry) => entry.slug === project.slug,
          );
          const suit = getArchiveSuit(projectIndex, 3);
          const marker = getArchiveMarker(projectIndex, 3);

          return (
            <article
              key={project.slug}
              className={`suit-card suit-scope suit-${suit.name} archive-card project-index-card group flex h-full flex-col p-5`}
            >
              <Link
                aria-label={`Open ${project.title}`}
                className="project-card-link project-card-visual-link"
                to={project.href}
              >
                <div aria-hidden="true" className="project-card-visual">
                  {project.coverImage ? (
                    <img
                      alt=""
                      className="project-cover-image h-full w-full object-contain p-3"
                      src={project.coverImage}
                    />
                  ) : (
                    <>
                      <span className="project-card-watermark">{marker}</span>
                      <span className="project-card-kind">
                        {getProjectKind(project)}
                      </span>
                      <span className="project-card-topic">
                        {project.tags?.slice(0, 2).join(" / ") ??
                          "Selected work"}
                      </span>
                    </>
                  )}
                </div>
              </Link>

              <div className="flex flex-1 flex-col pt-5">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <Link
                    className="project-card-link project-card-title-link min-w-0"
                    to={project.href}
                  >
                    <h2 className="suit-title text-ink font-serif text-2xl leading-tight">
                      {project.title}
                    </h2>
                    <p className="text-muted mt-1 text-sm">{project.year}</p>
                  </Link>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span aria-hidden="true" className="archive-marker text-xl">
                      {marker}
                    </span>
                    {project.status ? (
                      <TactilePill
                        className="project-chip project-status-tag"
                        suit={suit.name}
                      >
                        {project.status}
                      </TactilePill>
                    ) : null}
                  </div>
                </div>

                <p className="text-muted text-sm leading-7">
                  {project.summary}
                </p>

                {project.tags?.length ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <TactilePill
                        className="project-chip"
                        key={tag}
                        suit={suit.name}
                      >
                        {tag}
                      </TactilePill>
                    ))}
                  </div>
                ) : null}

                <Link
                  className="archive-inline-link project-card-link project-card-cta mt-6 w-fit text-sm font-bold"
                  to={project.href}
                >
                  Open project
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {filteredProjects.length === 0 ? (
        <div className="suit-watermark-card suit-card suit-scope suit-club archive-card p-6 text-center">
          <p className="text-muted text-sm leading-7">
            Nothing in this drawer yet. The label may be more ambitious than the
            filing cabinet.
          </p>
        </div>
      ) : null}

      {selectedProject ? (
        <div
          aria-describedby="project-dialog-summary"
          aria-labelledby="project-dialog-title"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          role="dialog"
        >
          <Link
            aria-label="Close project details"
            className="bg-ink/55 absolute inset-0 backdrop-blur-sm"
            to="/projects"
          />

          <div
            className={`suit-scope suit-${selectedSuit.name} archive-card relative z-10 flex max-h-[90svh] w-full max-w-5xl flex-col overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.2)]`}
          >
            <div className="border-line flex items-start justify-between gap-3 border-b px-6 py-5 sm:gap-6 sm:px-8">
              <div>
                <p className="text-muted text-xs font-semibold tracking-[0.24em] uppercase">
                  {selectedProject.year}
                </p>
                <h2
                  className="mt-2 font-serif text-3xl leading-tight text-[var(--route-accent)] sm:text-4xl"
                  id="project-dialog-title"
                >
                  {selectedProject.title}
                </h2>
              </div>

              <Link
                autoFocus
                className="archive-button archive-button-secondary"
                to="/projects"
              >
                Close
              </Link>
            </div>

            <div className="overflow-y-auto px-6 py-6 sm:px-8">
              <p
                className="text-muted mb-6 max-w-2xl text-sm leading-7 sm:text-base"
                id="project-dialog-summary"
              >
                {selectedProject.summary}
              </p>

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
                      View code
                    </a>
                  ) : null}
                  {selectedProject.liveUrl ? (
                    <a
                      className="archive-button archive-button-secondary"
                      href={selectedProject.liveUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Open live site
                    </a>
                  ) : null}
                </div>
              ) : null}

              {selectedProject.slug === "central-deploy-manager" ? (
                <DeploymentPipeline />
              ) : null}

              <section className="project-personal-notes-panel mb-6">
                <h3 className="project-section-label">My notes</h3>
                {selectedProject.personalNotes ? (
                  <MarkdownContent>
                    {selectedProject.personalNotes}
                  </MarkdownContent>
                ) : (
                  <p className="text-muted text-sm leading-7 italic sm:text-base">
                    I have not written the behind-the-scenes bit for this one
                    yet.
                  </p>
                )}
              </section>

              {selectedProject.aiSummary ? (
                <section className="project-ai-summary-panel">
                  <div className="project-ai-summary-label">
                    <span className="project-ai-summary-badge">01</span>
                    Technical summary
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
