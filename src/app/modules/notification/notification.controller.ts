import httpStatus from 'http-status-codes';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NotificationServices } from './notification.service';
import { JwtPayload } from 'jsonwebtoken';

const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  // If admin, we fetch system notifications (where user is not set)
  const userId =
    user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
      ? undefined
      : user.userId;
  const result = await NotificationServices.getMyNotifications(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications retrieved successfully',
    data: result,
  });
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const result = await NotificationServices.markAsRead(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification marked as read',
    data: result,
  });
});

const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const userId =
    user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
      ? undefined
      : user.userId;
  const result = await NotificationServices.markAllAsRead(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All notifications marked as read',
    data: result,
  });
});

const clearAll = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const userId =
    user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
      ? undefined
      : user.userId;
  const result = await NotificationServices.clearAll(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All notifications cleared',
    data: result,
  });
});

export const NotificationControllers = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  clearAll,
};
