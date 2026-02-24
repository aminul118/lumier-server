import { Types } from 'mongoose';

export type TNotificationType = 'Order' | 'System' | 'Payment' | 'Chat';

export interface INotification {
  user?: Types.ObjectId; // Optional: If empty, it's for all admins
  title: string;
  message: string;
  type: TNotificationType;
  isRead: boolean;
  orderId?: Types.ObjectId;
  conversationId?: Types.ObjectId;
  isDeleted: boolean;
  link?: string;
}
