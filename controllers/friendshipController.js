// controllers/friendshipController.js
const { Friendship } = require('../models/Friendships');
const { User } = require('../models/User');

const sendFriendRequest = async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    const existingFriendship = await Friendship.findOne({ where: { userId, friendId } });
    if (existingFriendship) {
      return res.status(400).json({ message: 'Friend request already exists' });
    }

    const newFriendship = await Friendship.create({ userId, friendId });
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

    if (status === 'accepted') {
      await User.update({ where: { id: friendship.userId } }, { friends: sequelize.fn('array_append', sequelize.col('friends'), friendship.friendId) });
      await User.update({ where: { id: friendship.friendId } }, { friends: sequelize.fn('array_append', sequelize.col('friends'), friendship.userId) });
    }

    friendship.status = status;
    await friendship.save();
    res.status(200).json({ message: 'Friendship status updated', friendship });
  } catch (error) {
    res.status(500).json({ message: 'Error updating friendship status', error });
  }
};

const getPendingFriendRequests = async (req, res) => {
  try {
    const { userId } = req.params;
    const pendingRequests = await Friendship.findAll({ where: { friendId: userId, status: 'pending' } });
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
    const { userId } = req.params;
    const friendships = await Friendship.findAll({ where: { $or: [{ userId }, { friendId: userId }], status: 'accepted' } });
    res.status(200).json(friendships);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching friends', error });
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