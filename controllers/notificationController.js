const Notification = require('../models/Notifications');

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { userId, type, message, relatedUserId, relatedLinkId, relatedCollectionId } = req.body;
    const newNotification = new Notification({
      userId,
      type,
      message,
      relatedUserId,
      relatedLinkId,
      relatedCollectionId
    });
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error });
  }
};

// Get all notifications for a user
const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
};

// Mark a notification as read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    notification.isRead = true;
    await notification.save();
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as read', error });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead
};
