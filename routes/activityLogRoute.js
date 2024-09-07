const express = require('express');
const router = express.Router();
const { getUserActivityLogs,createActivityLog } = require('../controllers/activityController');
const { protect } = require('../middlewares/authMiddleware'); // Correct import of protect middleware


// Route to get all activity logs for a specific user
router.get('/logs/:userId',protect, getUserActivityLogs);
router.post('/log',protect, createActivityLog);

module.exports = router;
