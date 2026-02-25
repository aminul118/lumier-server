import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { ChatService } from '../modules/chat/chat.service';

let io: SocketIOServer;
const activeChatSessions = new Map<string, string | null>();

export const initSocket = (server: HTTPServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*', // Adjust this to your client's URL for better security
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    },
  });

  io.on('connection', (socket) => {
    // Join a specific room (e.g., admin or userId)
    socket.on('join-room', (room: string) => {
      socket.join(room);
    });

    socket.on('join-user-room', (userId: string) => {
      socket.join(userId);
    });

    socket.on('set-active-chat', ({ userId, conversationId }) => {
      if (userId) {
        // eslint-disable-next-line no-console
        console.log(
          `Setting active chat: User ${userId} -> Conv ${conversationId}`,
        );
        activeChatSessions.set(userId, conversationId);
      }
    });

    socket.on('send-message', async (data) => {
      // data: { sender, receiver, text, conversationId, role }
      const { conversationId } = data;

      // Save to database
      try {
        await ChatService.sendMessage(data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error saving message:', error);
      }

      // Emit to the conversation room and receiver's private room
      // socket.to(...) excludes the sender automatically
      let emitter = socket.to(conversationId);
      if (data.receiver) {
        const receiverId =
          typeof data.receiver === 'object' ? data.receiver._id : data.receiver;
        emitter = emitter.to(receiverId);
      }
      emitter.emit('receive-message', data);

      // If sender is USER, notify all admins
      if (data.senderRole === 'USER') {
        io.to('admins').emit('new-user-message', data);
      }
    });

    socket.on('message-seen', async (data) => {
      // data: { conversationId, userId }
      try {
        await ChatService.markMessagesAsSeen(data.conversationId, data.userId);
        socket.to(data.conversationId).emit('messages-marked-seen', data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error marking messages as seen:', error);
      }
    });

    socket.on('disconnect', () => {
      // socket disconnect handle
    });
  });

  return io;
};

export const isRecipientInActiveChat = (
  userId: string,
  conversationId: string,
) => {
  const activeConversationId = activeChatSessions.get(userId);
  const isInChat = activeConversationId === conversationId;
  // eslint-disable-next-line no-console
  console.log(
    `Checking active status: User ${userId}, Conv ${conversationId}, ActiveConv ${activeConversationId} -> ${isInChat}`,
  );
  return isInChat;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

export const emitEvent = (event: string, data: unknown) => {
  if (io) {
    io.emit(event, data);
  }
};

export const emitToRoom = (room: string, event: string, data: unknown) => {
  if (io) {
    io.to(room).emit(event, data);
  }
};
