// routes/notificationRoute.js
const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');

router.post('/notifications', NotificationController.createNotification);
router.get('/notifications/:userId', NotificationController.getUserNotifications);
router.put('/notifications/:notificationId/read', NotificationController.markAsRead);

module.exports = router;