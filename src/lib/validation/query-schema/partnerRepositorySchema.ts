import { PlanTypes } from '@/lib/types';
import { z } from 'zod';

export const findAllQuerySchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(20),
  search: z.string().nullish(),
  status: z.string().nullish(),
  plan: z.enum([PlanTypes.BASIC, PlanTypes.STANDART]).nullish(),
});
