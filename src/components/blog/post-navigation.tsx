import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-base">Continue reading</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <Button asChild variant="outline" className="w-full justify-start text-left">
          {prev ? (
            <Link href={`/blog/${prev.slug}`}>
              <ArrowLeft />
              {prev.title}
            </Link>
          ) : (
            <span className="opacity-60">No older post</span>
          )}
        </Button>
        <Button asChild variant="outline" className="w-full justify-end text-right">
          {next ? (
            <Link href={`/blog/${next.slug}`}>
              {next.title}
              <ArrowRight />
            </Link>
          ) : (
            <span className="opacity-60">No newer post</span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
