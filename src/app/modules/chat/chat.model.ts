import { Schema, model } from 'mongoose';
import { IConversation, IMessage } from './chat.interface';

const conversationSchema = new Schema<IConversation>(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ],
    lastMessage: { type: String },
    lastMessageTime: { type: Date },
    unreadCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const messageSchema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'seen'],
      default: 'sent',
    },
    deliveredAt: { type: Date },
    seenAt: { type: Date },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Conversation = model<IConversation>(
  'Conversation',
  conversationSchema,
);
export const Message = model<IMessage>('Message', messageSchema);
