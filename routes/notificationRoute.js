// routes/notificationRoute.js
const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');
const {protect} = require('../middlewares/authMiddleware');

router.post('/notifications',protect, NotificationController.createNotification);
router.get('/notifications/:userId',protect, NotificationController.getUserNotifications);
router.put('/notifications/:notificationId/read',protect, NotificationController.markNotificationAsRead);

module.exports = router;