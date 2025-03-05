// routes/messageHistoryRoute.js
const express = require('express');
const router = express.Router();
const MessageHistoryController = require('../controllers/messageHistoryController');

router.post('/messages', MessageHistoryController.saveMessage);
router.get('/messages/conversations/:userId', MessageHistoryController.getConversationList);
router.get('/messages/:userId1/:userId2', MessageHistoryController.getMessagesWithLinksAndCollections);
router.put('/messages/:messageId/status', MessageHistoryController.updateMessageStatus);

module.exports = router;