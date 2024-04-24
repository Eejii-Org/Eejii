import { EventType } from '@/lib/db/enums';
import { z } from 'zod';

export const findAllQuerySchema = z.object({
  page: z.number().default(1),
  sort: z.enum(['asc', 'desc']).default('desc'),
  limit: z.number().default(20),
  title: z.string().nullish(),
  status: z.string().nullish(),
  enabled: z.boolean().nullish(),
  featured: z.boolean().nullish(),
  type: z.string().nullish().default(EventType.EVENT),
  partnerId: z.string().nullish(),
});

export const getMyEventsQuerySchema = z.object({
  name: z.string().nullish(),
  status: z.string().nullish(),
  type: z
    .enum([EventType.EVENT, EventType.VOLUNTEERING])
    .default(EventType.EVENT)
    .nullish(),
});

export const findRelatedQuerySchema = z.object({
  limit: z.number().nullish(),
  excludeId: z.string(),
});
