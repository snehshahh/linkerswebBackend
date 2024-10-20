const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware'); // Correct import of protect middleware

// Define your routes here
router.get('/profile/:userId', protect, userController.getProfile); // Use 'protect' instead of 'authenticate'
router.put('/update-profile/:userId',protect, userController.updateProfile);
router.post('/register', userController.registerUser);
router.get('/search-users/:userId',protect, userController.searchUsers);
router.post('/login', userController.loginUser);

module.exports = router;
