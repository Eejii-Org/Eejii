import * as z from 'zod';

// const phoneRegex = new RegExp(
//   /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
// );

export const userSignUpSchema = z.object({
  email: z.string().email(),
  // phoneNumber: z.string().regex(phoneRegex).length(8),
  phoneNumber: z.string(),
  password: z.string(),
  userType: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
