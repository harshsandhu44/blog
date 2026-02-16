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
import { siteConfig } from "@/config/site";
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
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl = `${siteConfig.url}/blog/${post.meta.slug}`;
  const ogImage = post.meta.coverImage
    ? post.meta.coverImage.startsWith("http")
      ? post.meta.coverImage
      : `${siteConfig.url}${post.meta.coverImage}`
    : siteConfig.ogImage;

  return {
    title: post.meta.title,
    description: post.meta.description,
    keywords: [...siteConfig.keywords, ...post.meta.tags],
    alternates: {
      canonical: `/blog/${post.meta.slug}`,
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: post.meta.title,
      description: post.meta.description,
      siteName: siteConfig.name,
      publishedTime: post.meta.date,
      modifiedTime: post.meta.updatedAt ?? post.meta.date,
      authors: ["Harsh Sandhu"],
      tags: post.meta.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta.title,
      description: post.meta.description,
      images: [ogImage],
      creator: "@harshsandhu44",
    },
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
  const postJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.meta.title,
    description: post.meta.description,
    datePublished: post.meta.date,
    dateModified: post.meta.updatedAt ?? post.meta.date,
    author: {
      "@type": "Person",
      name: post.meta.author ?? "Harsh Sandhu",
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Person",
      name: "Harsh Sandhu",
      url: siteConfig.url,
    },
    mainEntityOfPage: `${siteConfig.url}/blog/${post.meta.slug}`,
    image: post.meta.coverImage
      ? post.meta.coverImage.startsWith("http")
        ? post.meta.coverImage
        : `${siteConfig.url}${post.meta.coverImage}`
      : siteConfig.ogImage,
    keywords: post.meta.tags.join(", "),
  };

  return (
    <main className="chaos-shell mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-8 md:px-8 md:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd) }}
      />
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
