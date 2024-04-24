import { z } from 'zod';

export const mediaCreateSchema = z.object({
  title: z.string(),
  body: z.string(),
  categories: z.array(z.string()),
});

export const mediaUpdateSchema = z.object({
  mediaId: z.string(),
  title: z.string(),
  body: z.string(),
  categories: z.array(z.string()),
});
