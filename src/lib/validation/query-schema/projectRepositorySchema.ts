import { ProjectStatus, ProjectType } from '@/lib/db/enums';
import { z } from 'zod';

export const findAllQuerySchema = z.object({
  page: z.number().default(1),
  sort: z.enum(['asc', 'desc']).default('desc'),
  partnerId: z.string().nullish(),
  limit: z.number().default(20),
  title: z.string().nullish(),
  enabled: z.boolean().nullish(),
  featured: z.boolean().nullish(),
  status: z
    .enum([
      ProjectStatus.APPROVED,
      ProjectStatus.PENDING,
      ProjectStatus.DENIED,
      ProjectStatus.DONE,
    ])
    .nullish(),
  type: z
    .enum([ProjectType.FUNDRAISING, ProjectType.GRANT_FUNDRAISING])
    .nullish()
    .default(ProjectType.FUNDRAISING),
});

export const getMyProjectsQuerySchema = z.object({
  name: z.string().nullish(),
  type: z
    .enum([ProjectType.FUNDRAISING, ProjectType.GRANT_FUNDRAISING])
    .default(ProjectType.FUNDRAISING),
  status: z
    .enum([
      ProjectStatus.APPROVED,
      ProjectStatus.DENIED,
      ProjectStatus.DONE,
      ProjectStatus.PENDING,
    ])
    .nullish(),
});
