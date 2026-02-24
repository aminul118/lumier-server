import { INotification } from './notification.interface';
import { Notification } from './notification.model';

const createNotification = async (payload: INotification) => {
  const result = await Notification.create(payload);
  return result;
};

const getMyNotifications = async (userId: string | undefined) => {
  // If userId is undefined, it's for admins (system-wide notifications)
  const query = userId ? { user: userId } : { user: { $exists: false } };
  const result = await Notification.find(query).sort({ createdAt: -1 });
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

const markAllAsRead = async (userId: string | undefined) => {
  const query = userId ? { user: userId } : { user: { $exists: false } };
  const result = await Notification.updateMany(query, { isRead: true });
  return result;
};

const clearAll = async (userId: string | undefined) => {
  const query = userId ? { user: userId } : { user: { $exists: false } };
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
