import { FilterQuery } from 'mongoose';
import { INotification } from './notification.interface';
import { Notification } from './notification.model';
import { emitToRoom } from '../../config/socket';

const createNotification = async (payload: INotification) => {
  const result = await Notification.create(payload);
  if (result.user) {
    emitToRoom(result.user.toString(), 'new-notification', result);
  } else {
    // Notify all admins for system-wide notifications
    emitToRoom('admins', 'new-notification', result);
  }
};

const getMyNotifications = async (
  userId: string | undefined,
  role?: string,
) => {
  let query: FilterQuery<INotification>;
  if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
    // Admins get notifications specifically for them AND system-wide ones (no user set)
    query = userId
      ? {
          $or: [{ user: userId }, { user: { $exists: false } }, { user: null }],
        }
      : { user: { $exists: false } };
  } else {
    query = { user: userId };
  }

  const result = await Notification.find({ ...query, isDeleted: false }).sort({
    createdAt: -1,
  });
  return result;
};

const markAsRead = async (id: string) => {
  const result = await Notification.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true },
  );
  return result;
};

const markAllAsRead = async (userId: string | undefined, role?: string) => {
  let query: FilterQuery<INotification>;
  if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
    query = userId
      ? {
          $or: [{ user: userId }, { user: { $exists: false } }, { user: null }],
        }
      : { user: { $exists: false } };
  } else {
    query = { user: userId };
  }
  const result = await Notification.updateMany(query, { isRead: true });
  return result;
};

const clearAll = async (userId: string | undefined, role?: string) => {
  let query: FilterQuery<INotification>;
  if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
    query = userId
      ? {
          $or: [{ user: userId }, { user: { $exists: false } }, { user: null }],
        }
      : { user: { $exists: false } };
  } else {
    query = { user: userId };
  }
  const result = await Notification.updateMany(query, { isDeleted: true });
  return result;
};

const deleteByOrderId = async (orderId: string) => {
  const result = await Notification.updateMany(
    { orderId },
    { isDeleted: true },
  );
  return result;
};

export const NotificationServices = {
  createNotification,
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  clearAll,
  deleteByOrderId,
};
