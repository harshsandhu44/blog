import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_NODE_ENV = process.env.NODE_ENV;
const ORIGINAL_CONTENT_DIR = process.env.BLOG_CONTENT_DIR;

let tempContentDir = "";

async function writePost(fileName: string, frontmatter: string, body: string) {
  const filePath = path.join(tempContentDir, fileName);
  await writeFile(filePath, `---\n${frontmatter}\n---\n\n${body}\n`, "utf8");
}

async function loadPostsModule() {
  vi.resetModules();
  return import("./posts");
}

describe("content/posts", () => {
  beforeEach(async () => {
    tempContentDir = await mkdtemp(path.join(os.tmpdir(), "blog-posts-"));
    process.env.BLOG_CONTENT_DIR = tempContentDir;
    process.env.NODE_ENV = "test";
  });

  afterEach(async () => {
    await rm(tempContentDir, { recursive: true, force: true });
    process.env.BLOG_CONTENT_DIR = ORIGINAL_CONTENT_DIR;
    process.env.NODE_ENV = ORIGINAL_NODE_ENV;
    vi.resetModules();
  });

  it("loads valid markdown posts and sorts by date desc", async () => {
    await writePost(
      "newer.md",
      [
        "slug: newer",
        "title: Newer Post",
        "description: New post",
        "date: 2026-02-15",
        "author: Harsh",
      ].join("\n"),
      "# Newer",
    );
    await writePost(
      "older.md",
      [
        "slug: older",
        "title: Older Post",
        "description: Old post",
        "date: 2026-02-10",
      ].join("\n"),
      "# Older",
    );

    const { getAllPosts, getPostBySlug } = await loadPostsModule();
    const posts = await getAllPosts();

    expect(posts).toHaveLength(2);
    expect(posts[0]?.slug).toBe("newer");
    expect(posts[1]?.slug).toBe("older");

    const post = await getPostBySlug("newer");
    expect(post?.meta.title).toBe("Newer Post");
    expect(post?.html).toContain("<h1");
  });

  it("throws on duplicate slugs", async () => {
    const shared = ["slug: same", "description: duplicate", "date: 2026-02-11"].join("\n");
    await writePost("one.md", ["title: One", shared].join("\n"), "one");
    await writePost("two.md", ["title: Two", shared].join("\n"), "two");

    const { getAllPosts } = await loadPostsModule();
    await expect(getAllPosts()).rejects.toThrow("Duplicate slug detected");
  });

  it("throws when required frontmatter is missing", async () => {
    await writePost(
      "invalid.md",
      ["slug: missing-description", "title: Missing Description", "date: 2026-02-11"].join("\n"),
      "invalid",
    );

    const { getAllPosts } = await loadPostsModule();
    await expect(getAllPosts()).rejects.toThrow("Invalid frontmatter");
  });

  it("hides drafts in production and keeps drafts in non-production", async () => {
    await writePost(
      "published.md",
      [
        "slug: published",
        "title: Published",
        "description: visible",
        "date: 2026-02-12",
        "draft: false",
      ].join("\n"),
      "published",
    );
    await writePost(
      "draft.md",
      [
        "slug: draft",
        "title: Draft",
        "description: hidden in production",
        "date: 2026-02-13",
        "draft: true",
      ].join("\n"),
      "draft",
    );

    const { getAllPosts } = await loadPostsModule();

    process.env.NODE_ENV = "production";
    const prodPosts = await getAllPosts();
    expect(prodPosts.map((post) => post.slug)).toEqual(["published"]);

    process.env.NODE_ENV = "development";
    const devPosts = await getAllPosts();
    expect(devPosts.map((post) => post.slug)).toEqual(["draft", "published"]);
  });

  it("accepts unquoted YAML dates", async () => {
    await writePost(
      "yaml-date.md",
      [
        "slug: yaml-date",
        "title: YAML Date",
        "description: date parsing",
        "date: 2026-02-14",
      ].join("\n"),
      "works",
    );

    const { getAllPosts } = await loadPostsModule();
    const posts = await getAllPosts();
    expect(posts[0]?.slug).toBe("yaml-date");
  });
});
