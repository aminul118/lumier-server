import { Schema, model } from 'mongoose';
import { INotification } from './notification.interface';

const notificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Order', 'System', 'Payment'],
      default: 'Order',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Filter out deleted notifications by default
notificationSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

notificationSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Notification = model<INotification>(
  'Notification',
  notificationSchema,
);
