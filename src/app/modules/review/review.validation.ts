import { z } from 'zod';

const createReviewZodSchema = z.object({
  body: z.object({
    product: z.string({ required_error: 'Product ID is required' }),
    rating: z
      .number({ required_error: 'Rating is required' })
      .min(1, 'Minimum rating is 1')
      .max(5, 'Maximum rating is 5'),
    comment: z
      .string({ required_error: 'Comment is required' })
      .min(5, 'Comment must be at least 5 characters'),
  }),
});

export const ReviewValidation = {
  createReviewZodSchema,
};
