// routes/friendshipRoute.js
const express = require('express');
const router = express.Router();
const FriendshipController = require('../controllers/friendshipController');
const {protect} = require('../middlewares/authMiddleware');

router.post('/friendships',protect, FriendshipController.sendFriendRequest);
router.put('/friendships/:friendshipId',protect, FriendshipController.updateFriendRequestStatus);
router.get('/friendships/pending/:user_id',protect, FriendshipController.getPendingFriendRequests);
router.get('/friendships/:user_id',protect, FriendshipController.getFriends);
router.delete('/friendships/:friendshipId',protect, FriendshipController.deleteFriendship);

module.exports = router;