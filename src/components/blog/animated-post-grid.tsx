"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

import { PostCard } from "@/components/blog/post-card";
import type { PostSummary } from "@/lib/content/schema";

type AnimatedPostGridProps = {
  posts: PostSummary[];
};

export function AnimatedPostGrid({ posts }: AnimatedPostGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const wrappers = Array.from(
      container.querySelectorAll<HTMLElement>("[data-post-wrapper]"),
    );

    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(wrappers, { clearProps: "all" });
        return;
      }

      gsap.fromTo(
        wrappers,
        {
          autoAlpha: 0,
          y: 56,
          rotate: (_, target) =>
            target instanceof HTMLElement && target.dataset.cardIndex
              ? Number(target.dataset.cardIndex) % 2 === 0
                ? -2
                : 2
              : 0,
          scale: 0.96,
        },
        {
          autoAlpha: 1,
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 0.95,
          ease: "expo.out",
          stagger: {
            each: 0.1,
            from: "random",
          },
          clearProps: "opacity,visibility,transform",
        },
      );

      wrappers.forEach((wrapper) => {
        const moveX = gsap.quickTo(wrapper, "x", {
          duration: 0.35,
          ease: "power3.out",
        });
        const moveY = gsap.quickTo(wrapper, "y", {
          duration: 0.35,
          ease: "power3.out",
        });
        const rotate = gsap.quickTo(wrapper, "rotation", {
          duration: 0.45,
          ease: "power3.out",
        });

        const onMove = (event: PointerEvent) => {
          const bounds = wrapper.getBoundingClientRect();
          const px = (event.clientX - bounds.left) / bounds.width - 0.5;
          const py = (event.clientY - bounds.top) / bounds.height - 0.5;
          moveX(px * 10);
          moveY(py * 8);
          rotate(px * 2.8);
        };

        const onLeave = () => {
          moveX(0);
          moveY(0);
          rotate(0);
        };

        wrapper.addEventListener("pointermove", onMove);
        wrapper.addEventListener("pointerleave", onLeave);

        cleanups.push(() => {
          wrapper.removeEventListener("pointermove", onMove);
          wrapper.removeEventListener("pointerleave", onLeave);
        });
      });
    }, container);

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 gap-y-4 gap-x-6 md:grid-cols-2 lg:gap-y-6 lg:gap-x-8"
    >
      {posts.map((post, index) => (
        <div
          key={post.slug}
          data-post-wrapper
          data-card-index={String(index)}
          className="will-change-transform"
        >
          <PostCard post={post} index={index} />
        </div>
      ))}
    </div>
  );
}
