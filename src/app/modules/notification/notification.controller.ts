import httpStatus from 'http-status-codes';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NotificationServices } from './notification.service';
import { JwtPayload } from 'jsonwebtoken';

const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const result = await NotificationServices.getMyNotifications(
    user.userId,
    user.role,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications retrieved successfully',
    data: result,
  });
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const result = await NotificationServices.markAsRead(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification marked as read',
    data: result,
  });
});

const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const result = await NotificationServices.markAllAsRead(
    user.userId,
    user.role,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All notifications marked as read',
    data: result,
  });
});

const clearAll = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const result = await NotificationServices.clearAll(user.userId, user.role);
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
