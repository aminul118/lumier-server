/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewService } from './review.service';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const user = (req.user as any)._id;
  const result = await ReviewService.createReview({ ...req.body, user });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

const getProductReviews = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const result = await ReviewService.getProductReviews(productId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews retrieved successfully',
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req.user as any)._id;
  const result = await ReviewService.deleteReview(id as string, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review deleted successfully',
    data: result,
  });
});

const checkReviewEligibility = catchAsync(
  async (req: Request, res: Response) => {
    const { productId } = req.params;
    const userId = (req.user as any)._id;
    const result = await ReviewService.checkReviewEligibility(
      productId as string,
      userId,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Review eligibility checked successfully',
      data: result,
    });
  },
);

export const ReviewController = {
  createReview,
  getProductReviews,
  deleteReview,
  checkReviewEligibility,
};
