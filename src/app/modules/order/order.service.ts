import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { IOrder } from './order.interface';
import { Order } from './order.model';
import { QueryBuilder } from '../../utils/QueryBuilder';

const createOrderIntoDB = async (payload: IOrder) => {
  const result = await Order.create(payload);
  return result;
};

const getAllOrdersFromDB = async (query: Record<string, string>) => {
  const orderQuery = new QueryBuilder(
    Order.find({ isDeleted: false }).populate('user').populate('items.product'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await orderQuery.build();
  const meta = await orderQuery.getMeta();

  return {
    meta,
    result,
  };
};

const getMyOrdersFromDB = async (
  userId: string,
  query: Record<string, string>,
) => {
  const orderQuery = new QueryBuilder(
    Order.find({ user: userId, isDeleted: false }).populate('items.product'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await orderQuery.build();
  const meta = await orderQuery.getMeta();

  return {
    meta,
    result,
  };
};

const getSingleOrderFromDB = async (id: string) => {
  const result = await Order.findById(id)
    .populate('user')
    .populate('items.product');
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }
  return result;
};

const updateOrderStatusIntoDB = async (id: string, status: string) => {
  const result = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true },
  );
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }
  return result;
};

export const OrderServices = {
  createOrderIntoDB,
  getAllOrdersFromDB,
  getMyOrdersFromDB,
  getSingleOrderFromDB,
  updateOrderStatusIntoDB,
};
