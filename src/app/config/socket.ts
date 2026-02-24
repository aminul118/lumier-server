import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: SocketIOServer;

export const initSocket = (server: HTTPServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*', // Adjust this to your client's URL for better security
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join a specific room (e.g., admin or userId)
    socket.on('join-room', (room: string) => {
      socket.join(room);
      // eslint-disable-next-line no-console
      console.log(`Socket ${socket.id} joined room: ${room}`);
    });

    socket.on('disconnect', () => {
      // eslint-disable-next-line no-console
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
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
