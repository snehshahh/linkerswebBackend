// routes/userImpressionRoute.js
const express = require('express');
const router = express.Router();
const {protect} = require('../middlewares/authMiddleware');
const UserImpressionController = require('../controllers/userImpressionController');

router.post('/impressions',protect, UserImpressionController.saveImpression);

module.exports = router;