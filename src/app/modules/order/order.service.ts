import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { IOrder } from './order.interface';
import { Order } from './order.model';
import { Product } from '../product/product.model';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { emitEvent, emitToRoom } from '../../config/socket';
import { NotificationServices } from '../notification/notification.service';

const createOrderIntoDB = async (payload: IOrder) => {
  // Check stock for each item
  for (const item of payload.items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        `Product not found: ${item.product}`,
      );
    }
    if (product.stock < item.quantity) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Insufficient stock for ${product.name}. Available: ${product.stock}`,
      );
    }
  }

  // Atomically decrement stock
  for (const item of payload.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  const result = await Order.create(payload);

  // Emit socket event for admin to notify about new order
  if (result) {
    // Save persistent notification for admin
    await NotificationServices.createNotification({
      title: 'New Order Placed',
      message: `A new order #${result._id} has been placed by a user.`,
      type: 'Order',
      isRead: false,
      isDeleted: false,
      orderId: result._id,
    });

    emitEvent('new-order-placed', {
      orderId: result._id,
      totalPrice: result.totalPrice,
      user: result.user,
    });
  }

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

  // Increment soldCount if status is DELIVERED
  if (status === 'Delivered') {
    for (const item of result.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { soldCount: item.quantity },
      });
    }
  }

  // Emit socket events for real-time notification update
  if (result) {
    // Notify Admin (for stats update)
    if (status === 'Processing') {
      // Clear/Delete admin notifications for this order since it's now processing
      await NotificationServices.deleteByOrderId(result._id.toString());

      emitEvent('order-status-updated', {
        orderId: result._id,
        status: result.status,
      });
    }

    // Save persistent notification for User
    await NotificationServices.createNotification({
      user: result.user,
      title: 'Order Status Updated',
      message: `Your order status has been updated to ${status}`,
      type: 'Order',
      isRead: false,
      isDeleted: false,
      orderId: result._id,
    });

    // Notify Specific User
    emitToRoom(result.user.toString(), 'order-status-updated', {
      orderId: result._id,
      status: result.status,
      message: `Your order status has been updated to ${status}`,
    });
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
