import { Notification } from "../models/notification.model.js";

// ===========================
// Get my notifications (paginated-ish, latest 30)
// GET /api/v1/notification
// ===========================
export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.id })
      .sort({ createdAt: -1 })
      .limit(30)
      .populate("relatedJob", "title")
      .populate("relatedApplication", "status");

    const unreadCount = await Notification.countDocuments({
      recipient: req.id,
      isRead: false,
    });

    return res.status(200).json({
      notifications,
      unreadCount,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// ===========================
// Get just the unread count (cheap poll / badge refresh)
// GET /api/v1/notification/unread-count
// ===========================
export const getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({
      recipient: req.id,
      isRead: false,
    });

    return res.status(200).json({ unreadCount, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// ===========================
// Mark one notification as read
// PUT /api/v1/notification/mark-read/:id
// ===========================
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.id,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found.",
        success: false,
      });
    }

    notification.isRead = true;
    await notification.save();

    return res.status(200).json({
      message: "Notification marked as read.",
      notification,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// ===========================
// Mark ALL of my notifications as read
// PUT /api/v1/notification/mark-all-read
// ===========================
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.id, isRead: false },
      { $set: { isRead: true } },
    );

    return res.status(200).json({
      message: "All notifications marked as read.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// ===========================
// Delete one notification
// DELETE /api/v1/notification/:id
// ===========================
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.id,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Notification deleted.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// ===========================
// Clear ALL of my notifications
// DELETE /api/v1/notification/clear
// ===========================
export const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ recipient: req.id });

    return res.status(200).json({
      message: "All notifications cleared.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
