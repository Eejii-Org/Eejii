import { z } from 'zod';

export const permitSchema = z.object({
  id: z.string().nullish().nullable(),
  code: z
    .string({
      required_error: 'Please provide name',
    })
    .min(2, {
      message: 'Name must have at least 2 characters.',
    }),
  name: z
    .string({
      required_error: 'Please provide name',
    })
    .min(2, {
      message: 'Name must have at least 2 characters.',
    }),
  description: z
    .string({
      required_error: 'Please provide description',
    })
    .min(10, {
      message: 'Description must have at least 10 characters.',
    }),
  quantity: z.number({
    required_error: 'Please provide quantity',
  }),
  price: z.number({
    required_error: 'Please provide price',
  }),
  originalPrice: z.number({
    required_error: 'Please provide orignal price',
  }),
  type: z.string().nullable().nullish(),
  positionId: z
    .string({
      required_error: 'Please select banner position',
    })
    .nullable()
    .nullish(),
});
