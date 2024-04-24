import { z } from 'zod';
import { addressSchema } from '../address-validation-schema';

export const updateInfoSchema = z.object({
  userId: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  username: z.string().nullable(),
  email: z.string().email().nullable(),
  gender: z.string().nullable(),
  birthDate: z.date().nullable(),
  address: addressSchema,
});
