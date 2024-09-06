const express = require('express');
const router = express.Router();
const {
  sendFriendRequest,
  updateFriendRequestStatus,
  getFriends,
  deleteFriendship,
  getPendingFriendRequests
} = require('../controllers/friendshipController');
const { protect } = require('../middlewares/authMiddleware'); // Correct import of protect middleware



// Send a friend request
router.post('/friend-request',protect,sendFriendRequest);
// Accept or reject a friend request
router.put('/friend-request/:friendshipId',protect, updateFriendRequestStatus);
// Get all friends for a specific user
router.get('/friends/:userId',protect, getFriends);
// Delete a friendship
router.delete('/friendship/:friendshipId',protect,deleteFriendship);
router.get('/friend-requests/pending/:userId',protect, getPendingFriendRequests);
module.exports = router;
