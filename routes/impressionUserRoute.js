const express = require('express');
const router = express.Router();
const {
    saveImpression
} = require('../controllers/userImpressionController');
const { protect } = require('../middlewares/authMiddleware'); // Correct import of protect middleware

// Routes for message history
router.post('/save-impression', protect, saveImpression); // Save a message

module.exports = router;
