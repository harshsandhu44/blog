import { z } from "zod";

export const postFrontmatterSchema = z.object({
  slug: z
    .string()
    .min(1, "slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case"),
  title: z.string().min(1, "title is required"),
  description: z.string().min(1, "description is required"),
  date: z
    .string()
    .min(1, "date is required")
    .refine((value) => !Number.isNaN(Date.parse(value)), "date must be valid"),
  updatedAt: z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), "updatedAt must be valid")
    .optional(),
  coverImage: z.string().optional(),
  tags: z.array(z.string().min(1)).optional(),
  draft: z.boolean().optional(),
  author: z.string().min(1).optional(),
});

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;

export type PostSummary = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updatedAt?: string;
  coverImage?: string;
  tags: string[];
  draft: boolean;
  author?: string;
  readingTime: string;
};
