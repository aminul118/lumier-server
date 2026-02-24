import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { ICoupon } from './coupon.interface';
import { Coupon } from './coupon.model';
import { QueryBuilder } from '../../utils/QueryBuilder';

const createCouponIntoDB = async (payload: ICoupon) => {
  const result = await Coupon.create(payload);
  return result;
};

const getAllCouponsFromDB = async (query: Record<string, string>) => {
  const couponQuery = new QueryBuilder(Coupon.find({ isDeleted: false }), query)
    .search(['name', 'code'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await couponQuery.build();
  const meta = await couponQuery.getMeta();

  return {
    meta,
    result,
  };
};

const getSingleCouponFromDB = async (id: string) => {
  const result = await Coupon.findById(id);
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found');
  }
  return result;
};

const updateCouponIntoDB = async (id: string, payload: Partial<ICoupon>) => {
  const result = await Coupon.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found');
  }
  return result;
};

const deleteCouponFromDB = async (id: string) => {
  const result = await Coupon.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found');
  }
  return result;
};

const validateCouponFromDB = async (code: string) => {
  const result = await Coupon.findOne({
    code: code.toUpperCase(),
    isDeleted: false,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid Coupon Code');
  }

  const currentDate = new Date();
  if (result.expiryDate < currentDate) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Coupon has expired');
  }

  return result;
};

export const CouponServices = {
  createCouponIntoDB,
  getAllCouponsFromDB,
  getSingleCouponFromDB,
  updateCouponIntoDB,
  deleteCouponFromDB,
  validateCouponFromDB,
};
