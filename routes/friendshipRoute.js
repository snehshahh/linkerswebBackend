// routes/friendshipRoute.js
const express = require('express');
const router = express.Router();
const FriendshipController = require('../controllers/friendshipController');

router.post('/friendships', FriendshipController.sendFriendRequest);
router.put('/friendships/:friendshipId', FriendshipController.updateFriendRequestStatus);
router.get('/friendships/pending/:userId', FriendshipController.getPendingFriendRequests);
router.get('/friendships/:userId', FriendshipController.getFriends);
router.delete('/friendships/:friendshipId', FriendshipController.deleteFriendship);

module.exports = router;