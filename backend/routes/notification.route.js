import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", isAuthenticated, getMyNotifications);
router.get("/unread-count", isAuthenticated, getUnreadCount);
router.put("/mark-read/:id", isAuthenticated, markAsRead);
router.put("/mark-all-read", isAuthenticated, markAllAsRead);
router.delete("/clear", isAuthenticated, clearAllNotifications);
router.delete("/:id", isAuthenticated, deleteNotification);

export default router;
