// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');

// Define your routes here
router.get('/profile', authenticate, userController.getProfile);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

module.exports = router;
