import type { Metadata } from "next";

import { PostCard } from "@/components/blog/post-card";
import { SiteHeader } from "@/components/blog/site-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { getAllPosts } from "@/lib/content/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Harsh Sandhu - Notes on Tech, Business, and Life",
  description:
    "Personal writing on tech execution, business strategy, self-reflection, and in-progress thoughts.",
};

export default async function HomePage() {
  const posts = await getAllPosts();
  const tagCount = posts.reduce<Record<string, number>>((acc, post) => {
    for (const tag of post.tags) {
      acc[tag] = (acc[tag] ?? 0) + 1;
    }
    return acc;
  }, {});
  const topTags = Object.entries(tagCount)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3);

  return (
    <main className="chaos-shell mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8 md:py-10">
      <SiteHeader
        title="Harsh Sandhu"
        subtitle="Tech, business, self-reflection, and unfiltered working notes."
        actionSlot={<ThemeToggle />}
      />

      <section className="rounded-xl border border-border bg-muted/20 p-4 md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-medium">Posts</h2>
          <div className="flex flex-wrap gap-2">
            {topTags.map(([tag, count]) => (
              <Badge
                key={tag}
                variant="outline"
                className="capitalize"
              >{`${tag} (${count})`}</Badge>
            ))}
          </div>
        </div>

        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No posts yet.</p>
        ) : (
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
              {posts.map((post, index) => (
                <PostCard key={post.slug} post={post} index={index} />
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
