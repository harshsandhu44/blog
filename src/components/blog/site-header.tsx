"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Home, Menu } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type SiteHeaderProps = {
  title: string;
  subtitle: string;
  isPostPage?: boolean;
  postTitle?: string;
  actionSlot?: ReactNode;
};

export function SiteHeader({ title, subtitle, isPostPage, postTitle, actionSlot }: SiteHeaderProps) {
  return (
    <Card className="relative overflow-hidden border-border/60 bg-card/80 backdrop-blur-sm">
      <CardContent className="space-y-6 p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                {isPostPage && postTitle ? (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{postTitle}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                ) : null}
              </BreadcrumbList>
            </Breadcrumb>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" asChild>
                  <Link href="/">
                    <Home />
                    <span className="sr-only">Home</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Go to feed</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Menu</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Navigate</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/">Feed</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/blog/welcome-chaos">Featured post</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {actionSlot}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 md:hidden">
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="inline-flex items-center gap-2 rounded-md border border-border px-2 py-1 text-xs">
                <Avatar className="size-6 border border-border">
                  <AvatarFallback>HS</AvatarFallback>
                </Avatar>
                Author
              </div>
            </HoverCardTrigger>
            <HoverCardContent align="start" className="w-60">
              <p className="text-sm text-muted-foreground">Built by Harsh Sandhu with shadcn tokens and markdown content.</p>
            </HoverCardContent>
          </HoverCard>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>{title}</SheetTitle>
                <SheetDescription>{subtitle}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 grid gap-3">
                <Button asChild variant="outline">
                  <Link href="/">Feed</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/blog/welcome-chaos">Featured</Link>
                </Button>
                {actionSlot}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </CardContent>
    </Card>
  );
}
