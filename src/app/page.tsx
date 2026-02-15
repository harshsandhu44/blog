import type { Metadata } from "next";

import { PostCard } from "@/components/blog/post-card";
import { SiteHeader } from "@/components/blog/site-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllPosts } from "@/lib/content/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Markdown posts rendered with a chaotic but system-driven design language.",
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
        title="Chaotic Notes"
        subtitle="A markdown-first blog with strict design tokens."
        actionSlot={<ThemeToggle />}
      />

      <Tabs defaultValue="posts" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap gap-2">
            {topTags.length > 0 ? (
              topTags.map(([tag, count]) => (
                <Badge key={tag} variant="outline">{`${tag} (${count})`}</Badge>
              ))
            ) : (
              <Skeleton className="h-6 w-24" />
            )}
          </div>
        </div>

        <TabsContent value="posts">
          <ScrollArea className="h-[60vh] rounded-xl border border-border bg-muted/20 p-3 md:p-4">
            {posts.length === 0 ? (
              <div className="grid gap-3">
                <Skeleton className="h-36" />
                <Skeleton className="h-36" />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {posts.map((post, index) => (
                  <PostCard key={post.slug} post={post} index={index} />
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="system">
          <Accordion type="single" collapsible className="rounded-xl border border-border bg-card px-5">
            <AccordionItem value="tokens">
              <AccordionTrigger>Token constraints</AccordionTrigger>
              <AccordionContent>No hardcoded or palette colors in component code. Only semantic tokens.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="markdown">
              <AccordionTrigger>Content source</AccordionTrigger>
              <AccordionContent>All blog entries are loaded from markdown files in the local repository.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="ui">
              <AccordionTrigger>UI composition</AccordionTrigger>
              <AccordionContent>Layouts are composed with shadcn and Radix primitives, with playful offsets and rotations.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
    </main>
  );
}
