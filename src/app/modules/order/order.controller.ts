import httpStatus from 'http-status-codes';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OrderServices } from './order.service';
import { JwtPayload } from 'jsonwebtoken';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const result = await OrderServices.createOrderIntoDB({
    ...req.body,
    user: user.userId, // Assuming userId is the mongo _id here based on common JWT payload in this project
  });
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Order placed successfully',
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.getAllOrdersFromDB(
    req.query as Record<string, string>,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully',
    data: result.result,
    meta: result.meta,
  });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const result = await OrderServices.getMyOrdersFromDB(
    user.userId,
    req.query as Record<string, string>,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My orders retrieved successfully',
    data: result.result,
    meta: result.meta,
  });
});

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.getSingleOrderFromDB(
    req.params.id as string,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully',
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.updateOrderStatusIntoDB(
    req.params.id as string,
    req.body.status,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order status updated successfully',
    data: result,
  });
});

export const OrderControllers = {
  createOrder,
  getAllOrders,
  getMyOrders,
  getSingleOrder,
  updateOrderStatus,
};
