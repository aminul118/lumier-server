import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ChatService } from './chat.service';

interface AuthRequest extends Request {
  user: {
    _id: string;
    role: string;
    email: string;
  };
}

const getMyConversations = catchAsync(async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const result = await ChatService.getMyConversations(
    authReq.user._id,
    authReq.user.role,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Conversations retrieved successfully',
    data: result,
  });
});

const getOrCreateConversation = catchAsync(
  async (req: Request, res: Response) => {
    const { participants } = req.body;
    const result = await ChatService.getOrCreateConversation(participants);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Conversation retrieved or created successfully',
      data: result,
    });
  },
);

const getMessages = catchAsync(async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const result = await ChatService.getMessagesByConversation(conversationId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Messages retrieved successfully',
    data: result,
  });
});

const markAsSeen = catchAsync(async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const authReq = req as unknown as AuthRequest;
  await ChatService.markMessagesAsSeen(conversationId, authReq.user._id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Messages marked as seen',
    data: null,
  });
});

const getUnreadCount = catchAsync(async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const result = await ChatService.getUnreadCount(
    authReq.user._id,
    authReq.user.role,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Unread count retrieved successfully',
    data: result,
  });
});

export const ChatController = {
  getMyConversations,
  getOrCreateConversation,
  getMessages,
  markAsSeen,
  getUnreadCount,
};
