import { Types } from 'mongoose';

export interface IMessage {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  text: string;
  status: 'sent' | 'delivered' | 'seen';
  deliveredAt?: Date;
  seenAt?: Date;
  conversationId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IConversation {
  participants: Types.ObjectId[];
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
