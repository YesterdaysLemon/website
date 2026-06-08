import matter from "gray-matter";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

export type ProjectFrontmatter = {
  title: string;
  summary: string;
  year: number;
  status?: string;
  tags?: string[];
  repoUrl?: string;
  liveUrl?: string;
  coverImage?: string;
  order?: number;
};

export type ProjectEntry = ProjectFrontmatter & {
  slug: string;
  body: string;
  personalNotes: string;
  aiSummary: string;
  href: string;
};

export type BlogFrontmatter = {
  title: string;
  summary: string;
  publishedAt: string;
  tags?: string[];
  coverImage?: string;
  draft?: boolean;
};

export type BlogEntry = BlogFrontmatter & {
  slug: string;
  body: string;
  href: string;
};

const CONTENT_ROOT = path.join(process.cwd(), "content");

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(
  source: Record<string, unknown>,
  key: string,
  context: string,
): string {
  const value = source[key];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${context}: expected "${key}" to be a non-empty string.`);
  }

  return value.trim();
}

function readOptionalString(
  source: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = source[key];

  if (value == null || value === "") {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error(`Expected "${key}" to be a string when provided.`);
  }

  return value.trim();
}

function readOptionalStringArray(
  source: Record<string, unknown>,
  key: string,
): string[] | undefined {
  const value = source[key];

  if (value == null) {
    return undefined;
  }

  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`Expected "${key}" to be an array of strings.`);
  }

  return value.map((item) => item.trim()).filter(Boolean);
}

function readOptionalNumber(
  source: Record<string, unknown>,
  key: string,
): number | undefined {
  const value = source[key];

  if (value == null || value === "") {
    return undefined;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  throw new Error(`Expected "${key}" to be a number.`);
}

function readRequiredNumber(
  source: Record<string, unknown>,
  key: string,
  context: string,
): number {
  const value = readOptionalNumber(source, key);

  if (typeof value !== "number") {
    throw new Error(`${context}: expected "${key}" to be present.`);
  }

  return value;
}

function readOptionalBoolean(
  source: Record<string, unknown>,
  key: string,
): boolean | undefined {
  const value = source[key];

  if (value == null) {
    return undefined;
  }

  if (typeof value !== "boolean") {
    throw new Error(`Expected "${key}" to be a boolean.`);
  }

  return value;
}

function normalizeDateString(value: unknown, context: string): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${context}: expected a valid date string.`);
  }

  return ensureIsoDate(value, context);
}

function splitProjectBody(body: string): {
  personalNotes: string;
  aiSummary: string;
} {
  const markerPattern = /<!--\s*(personal-notes|ai-summary)\s*-->/g;
  const matches = Array.from(body.matchAll(markerPattern));

  if (matches.length === 0) {
    return {
      personalNotes: "",
      aiSummary: body.trim(),
    };
  }

  const sections = new Map<string, string>();

  for (const [index, match] of matches.entries()) {
    const markerName = match[1];
    const sectionStart = (match.index ?? 0) + match[0].length;
    const nextMatch = matches[index + 1];
    const sectionEnd = nextMatch?.index ?? body.length;

    sections.set(markerName, body.slice(sectionStart, sectionEnd).trim());
  }

  return {
    personalNotes: sections.get("personal-notes") ?? "",
    aiSummary: sections.get("ai-summary") ?? "",
  };
}

function ensureIsoDate(value: string, context: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${context}: expected a valid date string.`);
  }

  return value;
}

async function readMarkdownCollection<T>(
  collection: string,
  parser: (args: {
    slug: string;
    frontmatter: Record<string, unknown>;
    body: string;
  }) => T,
): Promise<T[]> {
  const collectionPath = path.join(CONTENT_ROOT, collection);
  const files = await readdir(collectionPath, { withFileTypes: true });

  const markdownFiles = files
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name);

  const entries = await Promise.all(
    markdownFiles.map(async (filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = await readFile(path.join(collectionPath, filename), "utf8");
      const parsed = matter(raw);

      if (!isRecord(parsed.data)) {
        throw new Error(
          `${collection}/${filename}: expected frontmatter object.`,
        );
      }

      return parser({
        slug,
        frontmatter: parsed.data,
        body: parsed.content.trim(),
      });
    }),
  );

  return entries;
}

export async function getProjects(): Promise<ProjectEntry[]> {
  const projects = await readMarkdownCollection(
    "projects",
    ({ slug, frontmatter, body }) => {
      const context = `content/projects/${slug}.md`;
      const projectBody = splitProjectBody(body);

      return {
        slug,
        title: readString(frontmatter, "title", context),
        summary: readString(frontmatter, "summary", context),
        year: readRequiredNumber(frontmatter, "year", context),
        status: readOptionalString(frontmatter, "status"),
        tags: readOptionalStringArray(frontmatter, "tags"),
        repoUrl: readOptionalString(frontmatter, "repoUrl"),
        liveUrl: readOptionalString(frontmatter, "liveUrl"),
        coverImage: readOptionalString(frontmatter, "coverImage"),
        order: readOptionalNumber(frontmatter, "order"),
        body,
        personalNotes: projectBody.personalNotes,
        aiSummary: projectBody.aiSummary,
        href: `/projects?project=${slug}`,
      };
    },
  );

  return projects.sort((left, right) => {
    const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    if (left.year !== right.year) {
      return right.year - left.year;
    }

    return left.title.localeCompare(right.title);
  });
}

export async function getBlogPosts(): Promise<BlogEntry[]> {
  const posts = await readMarkdownCollection(
    "blog",
    ({ slug, frontmatter, body }) => {
      const context = `content/blog/${slug}.md`;
      const publishedAt = normalizeDateString(
        frontmatter.publishedAt,
        `${context}: "publishedAt"`,
      );

      return {
        slug,
        title: readString(frontmatter, "title", context),
        summary: readString(frontmatter, "summary", context),
        publishedAt,
        tags: readOptionalStringArray(frontmatter, "tags"),
        coverImage: readOptionalString(frontmatter, "coverImage"),
        draft: readOptionalBoolean(frontmatter, "draft") ?? false,
        body,
        href: `/blog/${slug}`,
      };
    },
  );

  return posts.sort(
    (left, right) =>
      new Date(right.publishedAt).getTime() -
      new Date(left.publishedAt).getTime(),
  );
}

export async function getPublishedBlogPosts(): Promise<BlogEntry[]> {
  const posts = await getBlogPosts();
  return posts.filter((post) => !post.draft);
}

export async function getPublishedBlogPostBySlug(slug: string) {
  const posts = await getPublishedBlogPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}
