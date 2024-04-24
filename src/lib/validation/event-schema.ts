import { z } from 'zod';

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const roleSchema = z.string();

export const eventSchema = z.object({
  id: z.string().nullish(),
  type: z.string().nullish(),
  title: z.string().min(2, {
    message: 'Country must have at least 2 characters.',
  }),
  description: z
    .string({
      required_error: 'Please provide description',
    })
    .min(2, {
      message: 'Country must have at least 2 characters.',
    }),
  location: z
    .string({
      required_error: 'Please provide location info',
    })
    .min(2, {
      message: 'Country must have at least 2 characters.',
    }),
  startTime: z.date(),
  endTime: z.date(),
  contact: z.object({
    phone: z.string().regex(phoneRegex).length(8),
    email: z.string().email(),
  }),
  categories: z.array(z.string().nullable()),
  collaborators: z.array(z.string().nullable()).nullish(),
  maxVolunteers: z.optional(z.number()),
  volunteeringHours: z.optional(z.number()),
  roles: z.array(z.object({ name: z.string(), slots: z.number() })).nullish(),
});
