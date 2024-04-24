import { z } from 'zod';

export const addressSchema = z.object({
  countryCode: z
    .string()
    .min(2, {
      message: 'Country must have at least 2 characters.',
    })
    .nullable(),
  district: z.string().nullable(),
  city: z
    .string({
      required_error: 'Please select City',
    })
    .min(2, {
      message: 'Country must have at least 2 characters.',
    })
    .nullable(),
  provinceName: z
    .string({
      required_error: 'Please select Province',
    })
    .min(2, {
      message: 'Country must have at least 2 characters.',
    })
    .nullable(),
  street: z
    .string({
      required_error: 'Please select Street',
    })
    .min(2, {
      message: 'Country must have at least 2 characters.',
    })
    .nullable(),
});
