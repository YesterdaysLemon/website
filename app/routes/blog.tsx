import type { Route } from "./+types/blog";

import { Link } from "react-router";

import { PageShell } from "~/components/page-shell";
import { getPublishedBlogPosts } from "~/lib/content.server";

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
      intro="Short posts, working notes, and things worth writing down while building and learning."
      title="Blog"
    >
      <div className="space-y-5">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="border-line bg-card hover:border-ink rounded-[1.75rem] border p-6 transition hover:shadow-[0_24px_60px_rgba(23,33,38,0.06)] sm:p-8"
          >
            <div className="grid gap-6 lg:grid-cols-[0.78fr_0.22fr] lg:items-start">
              <div>
                <p className="text-muted text-xs font-semibold tracking-[0.25em] uppercase">
                  {formatDate(post.publishedAt)}
                </p>
                <h2 className="mt-3 font-serif text-3xl leading-tight">
                  <Link className="hover:text-accent transition" to={post.href}>
                    {post.title}
                  </Link>
                </h2>
                <p className="text-muted mt-4 max-w-2xl text-sm leading-7 sm:text-base">
                  {post.summary}
                </p>
              </div>

              <div className="space-y-4 lg:text-right">
                {post.tags?.length ? (
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-ink/5 text-ink rounded-full px-3 py-1 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <Link
                  className="text-accent inline-flex text-sm font-semibold"
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
