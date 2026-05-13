import type { Route } from "./+types/blog-post";

import { Link } from "react-router";

import { MarkdownContent } from "~/components/markdown-content";
import { PageShell } from "~/components/page-shell";
import { getPublishedBlogPostBySlug } from "~/lib/content.server";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export function meta({ data }: Route.MetaArgs) {
  return [
    {
      title: data
        ? `${data.post.title} | alireza afshan`
        : "blog | alireza afshan",
    },
    {
      name: "description",
      content: data?.post.summary ?? "Blog post",
    },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const post = await getPublishedBlogPostBySlug(params.slug);

  if (!post) {
    throw new Response("Not found", { status: 404 });
  }

  return { post };
}

export default function BlogPost({ loaderData }: Route.ComponentProps) {
  const { post } = loaderData;

  return (
    <PageShell
      eyebrow={formatDate(post.publishedAt)}
      intro={post.summary}
      routeId="blog"
      title={post.title}
    >
      <div className="space-y-5">
        <div className="text-muted flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <Link
            className="archive-inline-link w-fit font-bold"
            to="/blog"
          >
            take me back
          </Link>
          {post.tags?.length ? (
            <div className="flex flex-wrap gap-x-4 gap-y-2 sm:justify-end">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-bold tracking-[0.16em] text-[var(--route-accent)]/65 uppercase"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <article className="archive-card p-6 sm:p-8 lg:p-10">
          {post.coverImage ? (
            <img
              alt=""
              className="border-line bg-paper mb-8 aspect-[16/9] w-full rounded-[var(--radius)] border object-cover"
              src={post.coverImage}
            />
          ) : null}

          <div className="max-w-3xl">
            <MarkdownContent>{post.body}</MarkdownContent>
          </div>
        </article>
      </div>
    </PageShell>
  );
}
