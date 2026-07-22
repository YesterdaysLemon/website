import type { Route } from "./+types/showcase";

import { Link } from "react-router";

import { ConstructionMicroLab } from "~/components/construction-micro-lab";
import { PageShell } from "~/components/page-shell";
import { getProjects } from "~/lib/content.server";
import { getArchiveMarker } from "~/lib/route-design";

const liveProjectCopy: Record<
  string,
  { eyebrow: string; description: string; cta: string }
> = {
  "job-application-batch-builder": {
    eyebrow: "Public plugin + companion site",
    description:
      "An evidence-first Codex workflow for researching live roles and producing truthful, tailored application batches—with the privacy and support pages a real plugin needs.",
    cta: "Visit the plugin site",
  },
  aquarium: {
    eyebrow: "Now swimming",
    description:
      "A quiet little 3D fish tank for the browser. Pick a fish, move the camera around, and stay awhile.",
    cta: "Visit the aquarium",
  },
  "bird-of-the-day": {
    eyebrow: "Fresh bird daily",
    description:
      "One bird gets the front page every day, pulled from recent eBird sightings with a little help from Wikipedia.",
    cta: "Meet today's bird",
  },
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "showcase | alireza afshan" },
    {
      name: "description",
      content:
        "Live web tools, public plugins, strange little builds, and whatever Alireza is tinkering with next.",
    },
  ];
}

export async function loader() {
  const projects = await getProjects();

  return {
    liveProjects: projects.filter((project) => project.liveUrl),
    workbenchProjects: projects.filter(
      (project) => project.status?.toLowerCase() === "under construction",
    ),
  };
}

export default function Showcase({ loaderData }: Route.ComponentProps) {
  const { liveProjects, workbenchProjects } = loaderData;

  return (
    <PageShell
      eyebrow="Things I made"
      intro="A little pile of live experiments, weird side quests, and things I probably spent too long deploying."
      routeId="showcase"
      title="Showcase"
    >
      <div className="space-y-10">
        <section aria-labelledby="live-sites-title">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-muted text-xs font-extrabold tracking-[0.24em] uppercase">
                Actually on the internet
              </p>
              <h2
                className="mt-2 font-serif text-3xl text-[var(--route-accent)] sm:text-4xl"
                id="live-sites-title"
              >
                Live little websites
              </h2>
            </div>
            <p className="text-muted max-w-md text-sm leading-7 sm:text-right">
              These are real, clickable websites. No mockup theater here.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {liveProjects.map((project, index) => {
              const copy = liveProjectCopy[project.slug] ?? {
                eyebrow: "Live now",
                description: project.summary,
                cta: "Open live site",
              };

              return (
                <article
                  className="archive-card showcase-live-card flex h-full flex-col overflow-hidden"
                  key={project.slug}
                >
                  {project.coverImage ? (
                    <img
                      alt=""
                      className="showcase-live-image aspect-[16/9] w-full object-cover"
                      src={project.coverImage}
                    />
                  ) : null}

                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="showcase-live-status">
                          <span aria-hidden="true" />
                          {copy.eyebrow}
                        </p>
                        <h3 className="mt-3 font-serif text-3xl leading-tight text-[var(--route-accent)]">
                          {project.title}
                        </h3>
                      </div>
                      <span className="archive-marker text-2xl">
                        {getArchiveMarker("showcase", index)}
                      </span>
                    </div>

                    <p className="text-muted mt-4 flex-1 text-sm leading-7 sm:text-base">
                      {copy.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <a
                        className="archive-button archive-button-primary"
                        href={project.liveUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {copy.cta} <span aria-hidden="true">↗</span>
                      </a>
                      <Link
                        className="archive-button archive-button-secondary"
                        to={project.href}
                      >
                        Project notes
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section
          aria-labelledby="construction-title"
          className="archive-card showcase-construction-zone overflow-hidden"
          id="micro-experiments"
        >
          <div className="showcase-caution-tape" aria-hidden="true">
            Under construction · Please stand clear · Under construction ·
            Please stand clear
          </div>

          <div className="p-6 sm:p-8">
            <div className="max-w-2xl">
              <p className="text-xs font-extrabold tracking-[0.24em] text-[var(--route-accent)] uppercase">
                Permanent staff
              </p>
              <h2
                className="mt-2 font-serif text-3xl text-[var(--route-accent)] sm:text-4xl"
                id="construction-title"
              >
                The crew&apos;s tiny internet
              </h2>
              <p className="text-muted mt-4 text-sm leading-7 sm:text-base">
                These little guys used to ricochet around unfinished pages.
                They&apos;ve been promoted again, and now they operate several
                tiny, poorly regulated web systems. Push the buttons. Management
                has accepted the risk.
              </p>
            </div>

            <ConstructionMicroLab />
          </div>
        </section>

        {workbenchProjects.length ? (
          <section
            aria-labelledby="workbench-title"
            className="archive-card p-6 sm:p-8"
          >
            <p className="text-muted text-xs font-extrabold tracking-[0.24em] uppercase">
              Not ready for the internet yet
            </p>
            <h2
              className="mt-2 font-serif text-3xl text-[var(--route-accent)] sm:text-4xl"
              id="workbench-title"
            >
              Still on the workbench
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {workbenchProjects.map((project) => (
                <article
                  className="border-line bg-card rounded-[var(--radius)] border p-5"
                  key={project.slug}
                >
                  <h3 className="font-serif text-2xl text-[var(--route-accent)]">
                    {project.title}
                  </h3>
                  <p className="text-muted mt-3 text-sm leading-7">
                    {project.summary}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {project.repoUrl ? (
                      <a
                        className="archive-button archive-button-primary"
                        href={project.repoUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Peek at the repo <span aria-hidden="true">↗</span>
                      </a>
                    ) : null}
                    <Link
                      className="archive-button archive-button-secondary"
                      to={project.href}
                    >
                      Project notes
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </PageShell>
  );
}
