// routes/userImpressionRoute.js
const express = require('express');
const router = express.Router();
const UserImpressionController = require('../controllers/userImpressionController');

router.post('/impressions', UserImpressionController.saveImpression);

module.exports = router;