const express = require('express');
const { createNotification, getUserNotifications, markAsRead } = require('../controllers/notificationController');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware'); // Correct import of protect middleware


// Create a new notification
router.post('/',protect, createNotification);

// Get all notifications for a user
router.get('/:userId',protect, getUserNotifications);

// Mark a notification as read
router.patch('/:notificationId/read',protect, markAsRead);

module.exports = router;
