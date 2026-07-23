import { Server } from "socket.io";

let io = null;
let onlineUsers = new Map(); // userId -> socketId

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // Store user connection
    socket.on("join", (userId) => {
      if (userId) {
        onlineUsers.set(userId, socket.id);
        socket.userId = userId;
        console.log(`👤 User ${userId} joined with socket ${socket.id}`);
      }
    });

    // Join job room for real-time updates
    socket.on("joinJob", (jobId) => {
      socket.join(`job_${jobId}`);
      console.log(`📋 Socket ${socket.id} joined job room: job_${jobId}`);
    });

    // Leave job room
    socket.on("leaveJob", (jobId) => {
      socket.leave(`job_${jobId}`);
    });

    // Join admin room for recruiter notifications
    socket.on("joinAdmin", (userId) => {
      socket.join(`admin_${userId}`);
    });

    // Disconnect
    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
      }
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export const getOnlineUsers = () => onlineUsers;

// Helper to emit to specific job room
export const emitToJob = (jobId, event, data) => {
  if (io) {
    io.to(`job_${jobId}`).emit(event, data);
  }
};

// Helper to emit to admin
export const emitToAdmin = (adminId, event, data) => {
  if (io) {
    io.to(`admin_${adminId}`).emit(event, data);
  }
};

// Helper to broadcast to all
export const broadcast = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};
