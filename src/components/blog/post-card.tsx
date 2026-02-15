import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { PostSummary } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

const CHAOS_OFFSETS = ["rotate-1", "-rotate-1", "rotate-2", "-rotate-2"];
const CHAOS_TRANSLATES = [
  "md:translate-y-0",
  "md:-translate-y-3",
  "md:translate-y-2",
  "md:-translate-y-1",
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value));
}

type PostCardProps = {
  post: PostSummary;
  index: number;
};

export function PostCard({ post, index }: PostCardProps) {
  const offsetClass = CHAOS_OFFSETS[index % CHAOS_OFFSETS.length]
    .split(" ")
    .map((item) => `lg:${item}`)
    .join(" ");
  const translateClass = CHAOS_TRANSLATES[index % CHAOS_TRANSLATES.length]
    .split(" ")
    .map((item) =>
      item.startsWith("md:") ? item.replace("md:", "lg:") : `lg:${item}`,
    )
    .join(" ");

  return (
    <Card
      className={cn(
        "min-w-0 flex flex-col overflow-hidden transition-transform duration-300 hover:rotate-0 hover:translate-y-0",
        offsetClass,
        translateClass,
      )}
    >
      <CardHeader className="flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{formatDate(post.date)}</Badge>
          <Badge variant="outline">{post.readingTime}</Badge>
          {post.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="capitalize">
              {tag}
            </Badge>
          ))}
        </div>
        <CardTitle className="text-xl wrap-break-word">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription>{post.description}</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="py-2 flex items-center justify-between gap-4">
        <p className=" text-sm text-muted-foreground">
          By {post.author ?? "Unknown author"}
        </p>

        <Button asChild variant="link">
          <Link href={`/blog/${post.slug}`}>Read post</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
