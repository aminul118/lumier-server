import express from 'express';
import checkAuth from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { ReviewController } from './review.controller';
import { ReviewValidation } from './review.validation';

const router = express.Router();

router.post(
  '/',
  checkAuth('USER', 'ADMIN', 'SUPER_ADMIN'),
  validateRequest(ReviewValidation.createReviewZodSchema),
  ReviewController.createReview,
);

router.get('/:productId', ReviewController.getProductReviews);

router.get(
  '/check-eligibility/:productId',
  checkAuth('USER', 'ADMIN', 'SUPER_ADMIN'),
  ReviewController.checkReviewEligibility,
);

router.delete(
  '/:id',
  checkAuth('USER', 'ADMIN', 'SUPER_ADMIN'),
  ReviewController.deleteReview,
);

export const ReviewRoutes = router;
