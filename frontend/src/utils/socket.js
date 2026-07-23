import { io } from "socket.io-client";
import { toast } from "sonner";

const SOCKET_URL = import.meta.env.VITE_API_URL.replace("/api/v1", "");

let socket = null;

export const connectSocket = (userId) => {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log("🔌 Socket connected:", socket.id);
    if (userId) {
      socket.emit("join", userId);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

// ===========================
// Rooms
// ===========================
export const joinJobRoom = (jobId) => {
  if (socket) socket.emit("joinJob", jobId);
};

export const leaveJobRoom = (jobId) => {
  if (socket) socket.emit("leaveJob", jobId);
};

export const joinAdminRoom = (userId) => {
  if (socket) socket.emit("joinAdmin", userId);
};

// ===========================
// Generic subscribe helpers
// ===========================
export const subscribeToEvent = (event, callback) => {
  if (socket) socket.on(event, callback);
};

export const unsubscribeFromEvent = (event, callback) => {
  if (socket) socket.off(event, callback);
};

// Toast helper so every screen shows notifications consistently
export const notifyToast = (type, message, description) => {
  const fn = toast[type] || toast.info;
  fn(message, { description, duration: 5000 });
};
