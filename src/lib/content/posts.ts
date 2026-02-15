import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

import { ContentValidationError } from "@/lib/content/errors";
import { renderMarkdown } from "@/lib/content/markdown";
import { postFrontmatterSchema, type PostFrontmatter, type PostSummary } from "@/lib/content/schema";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

type ParsedPost = {
  filePath: string;
  meta: PostSummary;
  content: string;
};

const WORDS_PER_MINUTE = 200;

function getReadingTime(markdown: string): string {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}

function toPostSummary(frontmatter: PostFrontmatter, content: string): PostSummary {
  return {
    slug: frontmatter.slug,
    title: frontmatter.title,
    description: frontmatter.description,
    date: frontmatter.date,
    updatedAt: frontmatter.updatedAt,
    coverImage: frontmatter.coverImage,
    tags: frontmatter.tags ?? [],
    draft: frontmatter.draft ?? false,
    author: frontmatter.author,
    readingTime: getReadingTime(content),
  };
}

function getPostsDirectory(): string {
  if (process.env.BLOG_CONTENT_DIR) {
    return path.resolve(process.env.BLOG_CONTENT_DIR);
  }

  return POSTS_DIR;
}

async function readMarkdownFiles(): Promise<string[]> {
  const postsDir = getPostsDirectory();
  const entries = await readdir(postsDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(postsDir, entry.name));
}

function validateFrontmatter(raw: unknown, filePath: string): PostFrontmatter {
  const parsed = postFrontmatterSchema.safeParse(raw);
  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => issue.message).join(", ");
    throw new ContentValidationError(`Invalid frontmatter in ${path.basename(filePath)}: ${message}`, filePath);
  }

  return parsed.data;
}

async function parsePost(filePath: string): Promise<ParsedPost> {
  const raw = await readFile(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = validateFrontmatter(data, filePath);
  return {
    filePath,
    meta: toPostSummary(frontmatter, content),
    content,
  };
}

async function loadPosts(): Promise<ParsedPost[]> {
  const files = await readMarkdownFiles();
  const posts = await Promise.all(files.map((filePath) => parsePost(filePath)));
  const seenSlugs = new Set<string>();

  for (const post of posts) {
    if (seenSlugs.has(post.meta.slug)) {
      throw new ContentValidationError(
        `Duplicate slug detected: ${post.meta.slug} in ${path.basename(post.filePath)}`,
        post.filePath,
      );
    }
    seenSlugs.add(post.meta.slug);
  }

  const visiblePosts =
    process.env.NODE_ENV === "production" ? posts.filter((post) => !post.meta.draft) : posts;

  return visiblePosts.sort((left, right) => {
    return new Date(right.meta.date).getTime() - new Date(left.meta.date).getTime();
  });
}

export async function getAllPosts(): Promise<PostSummary[]> {
  const posts = await loadPosts();
  return posts.map((post) => post.meta);
}

export async function getPostBySlug(
  slug: string,
): Promise<{ meta: PostSummary; html: string } | null> {
  const posts = await loadPosts();
  const post = posts.find((item) => item.meta.slug === slug);

  if (!post) {
    return null;
  }

  return {
    meta: post.meta,
    html: await renderMarkdown(post.content),
  };
}

export async function getAdjacentPosts(
  slug: string,
): Promise<{ prev?: PostSummary; next?: PostSummary }> {
  const posts = await loadPosts();
  const index = posts.findIndex((post) => post.meta.slug === slug);

  if (index === -1) {
    return {};
  }

  return {
    prev: posts[index + 1]?.meta,
    next: posts[index - 1]?.meta,
  };
}
