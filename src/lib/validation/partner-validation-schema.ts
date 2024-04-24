import { z } from 'zod';

// const phoneRegex = new RegExp(
//   /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
// );

export const partnerSchema = z.object({
  id: z.string().nullish(),
  organizationType: z.string(),
  organizationName: z.string(),
  email: z.string().email({
    message: 'Please provide email',
  }),
  password: z.string().min(3, {
    message: 'Password must be at least 3 characters.',
  }),
  bio: z.string(),
  introduction: z.string(),
  contact: z.object({
    phoneNumber1: z.string(),
    phoneNumber2: z.string(),
  }),
  address: z.object({
    provinceName: z.string(),
    countryCode: z.string(),
    city: z.string(),
    district: z.string().nullable(),
    street: z.string().nullable(),
  }),
});
