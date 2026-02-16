import type { Metadata } from "next";

import { AnimatedPostGrid } from "@/components/blog/animated-post-grid";
import { PostPagination } from "@/components/blog/post-pagination";
import { SiteHeader } from "@/components/blog/site-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/content/posts";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams: Promise<{
    page?: string | string[];
  }>;
};

const POSTS_PER_PAGE = 4;

function getPageNumber(pageParam?: string | string[]) {
  const raw = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const parsed = Number(raw ?? "1");

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.floor(parsed);
}

export async function generateMetadata({ searchParams }: HomePageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const currentPage = getPageNumber(resolvedSearchParams.page);
  const pageTitle = currentPage > 1 ? `Blog - Page ${currentPage}` : "Blog";

  return {
    title: pageTitle,
    description:
      "Personal writing on tech execution, business strategy, self-reflection, and in-progress thoughts.",
    keywords: [
      ...siteConfig.keywords,
      "engineering blog",
      "product thinking",
      "startup execution",
    ],
    alternates: {
      canonical: currentPage <= 1 ? "/" : `/?page=${currentPage}`,
    },
    openGraph: {
      type: "website",
      title: `${pageTitle} | ${siteConfig.name}`,
      description:
        "Personal writing on tech execution, business strategy, self-reflection, and in-progress thoughts.",
      url: currentPage <= 1 ? siteConfig.url : `${siteConfig.url}/?page=${currentPage}`,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} | ${siteConfig.name}`,
      description:
        "Personal writing on tech execution, business strategy, self-reflection, and in-progress thoughts.",
      images: [siteConfig.ogImage],
      creator: "@harshsandhu44",
    },
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const posts = await getAllPosts();
  const latestPostHref = posts[0] ? `/${posts[0].slug}` : undefined;
  const resolvedSearchParams = await searchParams;
  const requestedPage = getPageNumber(resolvedSearchParams.page);
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);
  const sliceStart = (currentPage - 1) * POSTS_PER_PAGE;
  const visiblePosts = posts.slice(sliceStart, sliceStart + POSTS_PER_PAGE);
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
        latestPostHref={latestPostHref}
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

        {visiblePosts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No posts yet.</p>
        ) : (
          <div className="overflow-hidden">
            <AnimatedPostGrid posts={visiblePosts} />
            <PostPagination currentPage={currentPage} totalPages={totalPages} />
          </div>
        )}
      </section>
    </main>
  );
}
