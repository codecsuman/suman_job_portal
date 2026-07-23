import { Notification } from "../models/notification.model.js";
import { getIO, getOnlineUsers } from "./socket.js";

// ===========================
// sendNotification
// - Always writes to MongoDB (so it survives refresh / being offline)
// - Also emits live over the recipient's own socket if they're currently connected
// ===========================
export const sendNotification = async ({
  recipientId,
  type,
  title,
  message,
  relatedJob = null,
  relatedApplication = null,
}) => {
  const notification = await Notification.create({
    recipient: recipientId,
    type,
    title,
    message,
    relatedJob,
    relatedApplication,
  });

  try {
    const onlineUsers = getOnlineUsers();
    const socketId = onlineUsers.get(recipientId.toString());

    if (socketId) {
      getIO().to(socketId).emit("notification", { notification });
    }
  } catch (error) {
    // Socket layer not initialized yet, or user offline — the DB record
    // above is already saved, so nothing is actually lost.
    console.error("sendNotification live-delivery skipped:", error.message);
  }

  return notification;
};
