// routes/messageHistoryRoute.js
const express = require('express');
const router = express.Router();
const MessageHistoryController = require('../controllers/messageHistoryController');
const {protect} = require('../middlewares/authMiddleware');

router.post('/messages',protect, MessageHistoryController.saveMessage);
router.get('/messages/conversations/:userId',protect, MessageHistoryController.getConversationList);
router.get('/messages/:userId1/:userId2',protect, MessageHistoryController.getMessagesWithLinksAndCollections);
router.put('/messages/:messageId/status',protect, MessageHistoryController.updateMessageStatus);

module.exports = router;