# Harsh Sandhu Blog

Personal blog built with Next.js App Router, markdown-first content, shadcn components, and a token-driven chaotic visual style.

## Features

- Markdown-only posts from `content/posts/*.md`
- Dynamic post routes at `/blog/[slug]`
- Homepage pagination (`4` posts per page) via `/?page=2`
- GSAP-powered animated post card grid
- Light/Dark/System theme toggle
- shadcn component architecture with semantic color tokens
- Frontmatter validation and duplicate slug protection

## Tech Stack

- Next.js 16 (App Router, TypeScript)
- React 19
- shadcn/ui + Radix primitives
- Tailwind CSS v4
- `gray-matter`, `remark`, `rehype` for markdown parsing/rendering
- GSAP for post-card animations
- Vitest + ESLint for quality checks

## Project Structure

```text
content/posts/                 Markdown blog posts
src/app/page.tsx               Home feed + pagination
src/app/blog/[slug]/page.tsx   Post detail page
src/components/blog/           Blog UI components
src/components/ui/             shadcn UI primitives
src/lib/content/               Markdown parsing + validation pipeline
scripts/check-design-tokens.mjs
```

## Getting Started

### Prerequisites

- Bun (recommended) or Node.js 20+

### Install

```bash
bun install
```

### Run

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `bun run dev`: start local dev server
- `bun run build`: production build (`next build --webpack`)
- `bun run start`: run production server
- `bun run lint`: run ESLint
- `bun run test`: run Vitest + token guard
- `bun run check:tokens`: enforce no hardcoded/tailwind palette colors in `src`

## Writing Posts

Add a markdown file in `content/posts`.

Required frontmatter:

- `slug` (kebab-case, unique)
- `title`
- `description`
- `date`

Optional frontmatter:

- `updatedAt`
- `coverImage`
- `tags` (array)
- `draft` (hidden in production when `true`)
- `author`

Example:

```md
---
slug: shipping-weekly
title: Shipping Weekly
description: Why weekly cadence works.
date: 2026-02-10
tags:
  - business
  - execution
draft: false
author: Harsh Sandhu
---

# Post Title
```

## Pagination

- Feed shows `4` posts per page.
- Use `/?page=<n>` for navigation.
- Page controls render automatically based on total post count.

## Design Rules

- Use only shadcn components for UI composition.
- Use semantic shadcn color tokens (no hardcoded hex/rgb/hsl in component code).
- Keep markdown as the single source of truth for content.
