import * as z from 'zod';

export const fundInvitationSchema = z.object({
  partners: z.array(z.string()).nullable(),
  supporters: z.array(z.string()).nullable(),
  volunteers: z.array(z.string()).nullable(),
});
