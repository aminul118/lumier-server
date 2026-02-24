import express from 'express';
import checkAuth from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';
import { ChatController } from './chat.controller';

const router = express.Router();

router.get(
  '/my-conversations',
  checkAuth(Role.ADMIN, Role.USER, Role.SUPER_ADMIN),
  ChatController.getMyConversations,
);

router.post(
  '/get-or-create-conversation',
  checkAuth(Role.ADMIN, Role.USER, Role.SUPER_ADMIN),
  ChatController.getOrCreateConversation,
);

router.get(
  '/messages/:conversationId',
  checkAuth(Role.ADMIN, Role.USER, Role.SUPER_ADMIN),
  ChatController.getMessages,
);

router.patch(
  '/mark-as-seen/:conversationId',
  checkAuth(Role.ADMIN, Role.USER, Role.SUPER_ADMIN),
  ChatController.markAsSeen,
);

export const ChatRoutes = router;
