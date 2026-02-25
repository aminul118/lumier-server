import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CouponServices } from './coupon.service';

const createCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponServices.createCouponIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon created successfully',
    data: result,
  });
});

const getAllCoupons = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponServices.getAllCouponsFromDB(
    req.query as Record<string, string>,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupons retrieved successfully',
    data: result.result,
    meta: result.meta,
  });
});

const getSingleCoupon = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CouponServices.getSingleCouponFromDB(id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon retrieved successfully',
    data: result,
  });
});

const updateCoupon = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CouponServices.updateCouponIntoDB(
    id as string,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon updated successfully',
    data: result,
  });
});

const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CouponServices.deleteCouponFromDB(id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon deleted successfully',
    data: result,
  });
});

const validateCoupon = catchAsync(async (req: Request, res: Response) => {
  const { code } = req.params;
  const result = await CouponServices.validateCouponFromDB(code as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon is valid',
    data: result,
  });
});

export const CouponControllers = {
  createCoupon,
  getAllCoupons,
  getSingleCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
};
