import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { PostSummary } from "@/lib/content/schema";

type PostNavigationProps = {
  prev?: PostSummary;
  next?: PostSummary;
};

export function PostNavigation({ prev, next }: PostNavigationProps) {
  if (!prev && !next) {
    return null;
  }

  return (
    <section className="grid gap-3 md:grid-cols-2">
      <Card className="min-h-32">
        <CardHeader className="pb-3">
          <Badge variant="outline" className="w-fit">
            Previous
          </Badge>
        </CardHeader>
        <CardContent>
          {prev ? (
            <Link href={`/blog/${prev.slug}`} className="group inline-flex items-start gap-2 text-base font-medium leading-snug hover:underline">
              <ArrowLeft className="mt-0.5 size-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
              <span className="break-words">{prev.title}</span>
            </Link>
          ) : (
            <p className="text-sm text-muted-foreground">You are at the first post in this sequence.</p>
          )}
        </CardContent>
      </Card>

      <Card className="min-h-32">
        <CardHeader className="pb-3">
          <Badge variant="outline" className="w-fit">
            Next
          </Badge>
        </CardHeader>
        <CardContent>
          {next ? (
            <Link href={`/blog/${next.slug}`} className="group inline-flex items-start gap-2 text-base font-medium leading-snug hover:underline">
              <span className="break-words">{next.title}</span>
              <ArrowRight className="mt-0.5 size-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
            </Link>
          ) : (
            <p className="text-sm text-muted-foreground">No newer post available yet.</p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
