const express = require('express');
const router = express.Router();
const {
    saveMessage,
    getMessagesWithLinksAndCollections,
    updateMessageStatus,
    getConversationList
} = require('../controllers/messageHistoryController');
const { protect } = require('../middlewares/authMiddleware'); // Correct import of protect middleware

// Routes for message history
router.post('/', protect, saveMessage); // Save a message
router.get('/conversation-list/:userId', protect, getConversationList); // Get conversation list
router.get('/:userId1/:userId2', protect, getMessagesWithLinksAndCollections); // Get message history
router.patch('/:messageId/status', protect, updateMessageStatus); // Update message status

module.exports = router;
