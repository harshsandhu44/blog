import { cn } from "@/lib/utils";

type PostProseProps = {
  html: string;
  className?: string;
};

export function PostProse({ html, className }: PostProseProps) {
  return (
    <div
      className={cn(
        "post-prose rounded-xl border border-border bg-card p-5 shadow-sm md:p-8",
        "prose-tokenized",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
