import { z } from 'zod';
import { addressSchema } from '../address-validation-schema';

export const bioSchema = z.object({
  organizationName: z.string().nullable(),
  bio: z.string().nullable(),
  addressId: z.string().nullable().nullish(),
  address: addressSchema,
});
