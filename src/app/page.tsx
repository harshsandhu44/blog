import type { Metadata } from "next";
import Link from "next/link";

import { getAllPosts } from "@/lib/content/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Markdown posts rendered with a chaotic but system-driven design language.",
};

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-12">
      <h1 className="text-4xl font-semibold tracking-tight">Blog</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug} className="rounded-lg border border-border bg-card p-4">
            <Link href={`/blog/${post.slug}`} className="text-xl font-medium hover:underline">
              {post.title}
            </Link>
            <p className="mt-2 text-muted-foreground">{post.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
