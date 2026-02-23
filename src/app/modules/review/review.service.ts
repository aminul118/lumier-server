import httpStatus from 'http-status-codes';
import { Order } from '../order/order.model';
import { Product } from '../product/product.model';
import { IReview } from './review.interface';
import { Review } from './review.model';
import AppError from '../../errorHelpers/AppError';
import { OrderStatus } from '../order/order.interface';

const createReview = async (payload: IReview) => {
  // Check if user has purchased the product and it is delivered
  const order = await Order.findOne({
    user: payload.user,
    status: OrderStatus.DELIVERED,
    'items.product': payload.product,
  });

  if (!order) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You can only review products you have purchased and received.',
    );
  }

  // Check if already reviewed
  const existingReview = await Review.findOne({
    user: payload.user,
    product: payload.product,
  });

  if (existingReview) {
    throw new AppError(
      httpStatus.CONFLICT,
      'You have already reviewed this product.',
    );
  }

  const result = await Review.create(payload);

  // Update product rating
  const reviews = await Review.find({ product: payload.product });
  const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  await Product.findByIdAndUpdate(payload.product, { rating: averageRating });

  return result;
};

const getProductReviews = async (productId: string) => {
  const result = await Review.find({ product: productId, isDeleted: false })
    .populate('user', 'firstName lastName image')
    .sort({ createdAt: -1 });
  return result;
};

const deleteReview = async (id: string, userId: string) => {
  const review = await Review.findById(id);
  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }
  if (review.user.toString() !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You can only delete your own reviews',
    );
  }
  const result = await Review.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  // Update product rating after deletion
  const reviews = await Review.find({
    product: review.product,
    isDeleted: false,
  });
  const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
  await Product.findByIdAndUpdate(review.product, { rating: averageRating });

  return result;
};

const checkReviewEligibility = async (productId: string, userId: string) => {
  const order = await Order.findOne({
    user: userId,
    status: OrderStatus.DELIVERED,
    'items.product': productId,
  });

  return { eligible: !!order };
};

export const ReviewService = {
  createReview,
  getProductReviews,
  deleteReview,
  checkReviewEligibility,
};
