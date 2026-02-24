import { FilterQuery, UpdateQuery, Types } from 'mongoose';
import { Message, Conversation } from './chat.model';
import { IMessage, IConversation } from './chat.interface';
import { User } from '../user/user.model';
import { Role } from '../user/user.interface';
import { NotificationServices } from '../notification/notification.service';
import { Notification } from '../notification/notification.model';

const sendMessage = async (payload: IMessage) => {
  const message = await Message.create(payload);

  // Update conversation with last message info
  await Conversation.findByIdAndUpdate(payload.conversationId, {
    lastMessage: payload.text,
    lastMessageTime: new Date(),
    $inc: { unreadCount: 1 },
  });

  // Create notification for the receiver
  const sender = await User.findById(payload.sender);
  if (sender) {
    // Clear existing chat notifications for this conversation for the receiver
    await Notification.updateMany(
      {
        conversationId: payload.conversationId,
        type: 'Chat',
        user: payload.receiver,
        isRead: false,
      },
      { isRead: true },
    );

    await NotificationServices.createNotification({
      title: `New message from ${sender.firstName}`,
      message:
        payload.text.substring(0, 50) + (payload.text.length > 50 ? '...' : ''),
      type: 'Chat',
      user: payload.receiver, // This correctly handles both Admin (receiver=null/admins) and User
      isRead: false,
      isDeleted: false,
      conversationId: payload.conversationId as Types.ObjectId,
      link: sender.role === Role.USER ? '/admin/chat' : '/profile/chat',
    });
  }

  return message;
};

const getMessagesByConversation = async (conversationId: string) => {
  return await Message.find({ conversationId })
    .sort({ createdAt: 1 })
    .populate('sender receiver', 'firstName lastName picture email');
};

const updateMessageStatus = async (
  messageId: string,
  status: 'delivered' | 'seen',
) => {
  const updateData: UpdateQuery<IMessage> = { status };
  if (status === 'delivered') updateData.deliveredAt = new Date();
  if (status === 'seen') updateData.seenAt = new Date();

  return await Message.findByIdAndUpdate(messageId, updateData, { new: true });
};

const getOrCreateConversation = async (participants: string[]) => {
  // If only user is provided, find an admin to associate (default primary admin)
  if (participants.length === 1) {
    const admin = await User.findOne({ role: Role.ADMIN, isDeleted: false });
    if (admin) {
      participants.push(admin._id.toString());
    }
  }

  let conversation = await Conversation.findOne({
    participants: { $all: participants },
  }).populate('participants', 'firstName lastName picture email role');

  if (!conversation) {
    conversation = await Conversation.create({
      participants,
    });
    conversation = await Conversation.findById(conversation._id).populate(
      'participants',
      'firstName lastName picture email role',
    );
  }

  return conversation;
};

const getMyConversations = async (userId: string, role: string) => {
  const query: FilterQuery<IConversation> = { isDeleted: false };

  // If user is not admin, only show their conversations
  if (role === Role.USER) {
    query.participants = userId;
  }
  // If admin, show all conversations with users

  return await Conversation.find(query)
    .populate('participants', 'firstName lastName picture email role')
    .sort({ updatedAt: -1 });
};

const markMessagesAsSeen = async (conversationId: string, userId: string) => {
  await Message.updateMany(
    { conversationId, receiver: userId, status: { $ne: 'seen' } },
    { status: 'seen', seenAt: new Date() },
  );

  await Conversation.findByIdAndUpdate(conversationId, { unreadCount: 0 });

  // Clear related notifications
  await Notification.updateMany(
    {
      conversationId,
      user: userId,
      type: 'Chat',
      isRead: false,
    },
    { isRead: true },
  );
};

const getUnreadCount = async (userId: string, role: string) => {
  const query: FilterQuery<IConversation> = {
    unreadCount: { $gt: 0 },
    isDeleted: false,
  };

  if (role === Role.USER) {
    query.participants = userId;
  }
  // For Admin, it shows all conversations with unread messages

  const conversations = await Conversation.find(query);
  return conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);
};

export const ChatService = {
  sendMessage,
  getMessagesByConversation,
  updateMessageStatus,
  getOrCreateConversation,
  getMyConversations,
  markMessagesAsSeen,
  getUnreadCount,
};
