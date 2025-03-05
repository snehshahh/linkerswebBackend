// routes/userRoute.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const {protect} =require('../middlewares/authMiddleware')

router.post('/users/register', UserController.registerUser);
router.post('/users/login', UserController.loginUser);
router.get('/users/:userId',protect, UserController.getProfile);
router.put('/users/:userId',protect, UserController.updateProfile);
router.get('/users/:userId/search',protect, UserController.searchUsers);

module.exports = router;