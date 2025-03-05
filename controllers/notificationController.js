// controllers/notificationController.js
const { Notification } = require('../models/Notifications');

const createNotification = async (req, res) => {
  try {
    const { userId, type, message, relatedUserId, relatedLinkId, relatedCollectionId } = req.body;
    const newNotification = await Notification.create({ userId, type, message, relatedUserId, relatedLinkId, relatedCollectionId });
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error });
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByPk(notificationId);
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
  markAsRead,
};