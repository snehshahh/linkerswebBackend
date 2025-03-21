// controllers/friendshipController.js
const  Friendship  = require('../models/Friendships');
const { Op } = require('sequelize');

const  User  = require('../models/User');

const sendFriendRequest = async (req, res) => {
  try {
    const { user_id, friend_id } = req.body;
    const existingFriendship = await Friendship.findOne({ where: { user_id, friend_id } });
    if (existingFriendship) {
      return res.status(400).json({ message: 'Friend request already exists' });
    }

    const newFriendship = await Friendship.create({  user_id, friend_id });
    res.status(201).json(newFriendship);
  } catch (error) {
    res.status(500).json({ message: 'Error sending friend request', error });
  }
};

const updateFriendRequestStatus = async (req, res) => {
  try {
    const { friendshipId } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const friendship = await Friendship.findByPk(friendshipId);
    if (!friendship) {
      return res.status(404).json({ message: 'Friendship not found' });
    }

    // Update friendship status
    friendship.status = status;
    await friendship.save();

    res.status(200).json({ message: 'Friendship status updated', friendship });
  } catch (error) {
    console.error('Error updating friendship status:', error);
    res.status(500).json({ message: 'Error updating friendship status', error: error.message });
  }
};


const getPendingFriendRequests = async (req, res) => {
  try {
    const { user_id } = req.params;
    const pendingRequests = await Friendship.findAll({ where: { friend_id: user_id, status: 'pending' } });
    if (!pendingRequests.length) {
      return res.status(200).json({ message: 'No pending friend requests found' });
    }
    res.status(200).json(pendingRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending friend requests', error });
  }
};

const getFriends = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Ensure `user_id` is correctly parsed as an integer if necessary
    const friendships = await Friendship.findAll({ 
      where: { 
        [Op.or]: [{ user_id: user_id }, { friend_id: user_id }], 
        status: 'accepted' 
      } 
    });

    res.status(200).json(friendships);
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ message: 'Error fetching friends', error: error.message });
  }
};

const deleteFriendship = async (req, res) => {
  try {
    const { friendshipId } = req.params;
    const friendship = await Friendship.destroy({ where: { id: friendshipId } });
    if (!friendship) {
      return res.status(404).json({ message: 'Friendship not found' });
    }
    res.status(200).json({ message: 'Friendship deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting friendship', error });
  }
};

module.exports = {
  sendFriendRequest,
  updateFriendRequestStatus,
  getFriends,
  deleteFriendship,
  getPendingFriendRequests,
};