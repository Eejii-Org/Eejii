import { PartnerType } from '@/lib/db/enums';
import { z } from 'zod';

export const findAllQuerySchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(20),
  search: z.string().nullish(),
  status: z.string().nullish(),
  partnerType: z.enum([PartnerType.BASIC, PartnerType.PREMIUM]).nullish(),
});
