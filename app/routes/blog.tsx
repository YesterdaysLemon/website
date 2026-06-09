import type { Route } from "./+types/blog";

import { Link } from "react-router";

import { PageShell } from "~/components/page-shell";
import { getPublishedBlogPosts } from "~/lib/content.server";
import { getArchiveMarker } from "~/lib/route-design";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "blog | alireza afshan" },
    {
      name: "description",
      content:
        "Notes on software, systems, delivery, and maintaining a small site.",
    },
  ];
}

export async function loader() {
  return {
    posts: await getPublishedBlogPosts(),
  };
}

export default function Blog({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;

  return (
    <PageShell
      eyebrow="Notes"
      intro="Writing about the systems, tools, and decisions behind the work I build."
      routeId="blog"
      title="Blog"
    >
      <div className="space-y-5">
        {posts.map((post, index) => (
          <article
            key={post.slug}
            className="archive-card p-6 sm:p-8"
          >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
              <div>
                <p className="text-muted text-xs font-semibold tracking-[0.25em] uppercase">
                  {formatDate(post.publishedAt)}
                </p>
                <h2 className="mt-3 font-serif text-3xl leading-tight text-[var(--route-accent)]">
                  <Link className="archive-card-link" to={post.href}>
                    {post.title}
                  </Link>
                </h2>
                <p className="text-muted mt-4 max-w-2xl text-sm leading-7 sm:text-base">
                  {post.summary}
                </p>
              </div>

              <div className="space-y-4 lg:text-right">
                <div className="flex justify-end">
                  <span className="archive-marker text-2xl">
                    {getArchiveMarker("blog", index)}
                  </span>
                </div>
                {post.tags?.length ? (
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="archive-tag"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <Link
                  className="archive-button archive-button-primary inline-flex"
                  to={post.href}
                >
                  Read post
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
