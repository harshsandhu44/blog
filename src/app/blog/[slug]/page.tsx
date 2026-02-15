import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PostNavigation } from "@/components/blog/post-navigation";
import { PostProse } from "@/components/blog/post-prose";
import { SiteHeader } from "@/components/blog/site-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAdjacentPosts, getPostBySlug } from "@/lib/content/posts";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: post.meta.title,
    description: post.meta.description,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }
  const adjacent = await getAdjacentPosts(slug);

  const publishedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(post.meta.date));

  return (
    <main className="chaos-shell mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-8 md:px-8 md:py-10">
      <SiteHeader
        title={post.meta.title}
        subtitle={post.meta.description}
        isPostPage
        postTitle={post.meta.title}
        actionSlot={<ThemeToggle />}
      />

      <article className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{publishedDate}</Badge>
          <Badge variant="outline">{post.meta.readingTime}</Badge>
          {post.meta.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
          <Button asChild variant="ghost" size="sm" className="ml-auto">
            <Link href="/">Back to feed</Link>
          </Button>
        </div>
        <Separator />
        <PostProse html={post.html} />
      </article>

      <PostNavigation prev={adjacent.prev} next={adjacent.next} />
    </main>
  );
}
