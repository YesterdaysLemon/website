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
      title={post.title}
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <Link
            className="border-line text-muted hover:border-ink hover:text-ink rounded-full border px-3 py-1.5 text-sm transition"
            to="/blog"
          >
            Back to blog
          </Link>
          {post.tags?.map((tag) => (
            <span
              key={tag}
              className="bg-ink/5 text-ink rounded-full px-3 py-1 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        <article className="border-line bg-card rounded-[2rem] border p-6 sm:p-8">
          {post.coverImage ? (
            <img
              alt=""
              className="border-line bg-paper mb-8 aspect-[16/9] w-full rounded-[1.5rem] border object-cover"
              src={post.coverImage}
            />
          ) : null}

          <MarkdownContent>{post.body}</MarkdownContent>
        </article>
      </div>
    </PageShell>
  );
}
