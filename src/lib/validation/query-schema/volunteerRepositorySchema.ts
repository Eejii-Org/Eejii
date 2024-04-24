import { RequestStatus } from '@/lib/db/enums';
import { z } from 'zod';

export const findAllQuerySchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(20),
  status: z
    .enum([
      RequestStatus.REQUEST_PENDING,
      RequestStatus.REQUEST_DENIED,
      RequestStatus.REQUEST_APPROVED,
    ])
    .nullish(),
  search: z.string().nullish(),
});
