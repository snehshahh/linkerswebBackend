const Friendship = require('../models/Friendships');
const User=require('../models/User')

// Send a friend request
const sendFriendRequest = async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    // Check if friendship already exists
    const existingFriendship = await Friendship.findOne({ userId, friendId });
    if (existingFriendship) {
      return res.status(400).json({ message: 'Friend request already exists' });
    }

    const newFriendship = new Friendship({ userId, friendId });
    await newFriendship.save();
    res.status(201).json(newFriendship);
  } catch (error) {
    res.status(500).json({ message: 'Error sending friend request', error });
  }
};

// Accept or reject a friend request
const updateFriendRequestStatus = async (req, res) => {
  try {
    const { friendshipId } = req.params;
    const { status } = req.body;

    // Ensure status is either 'accepted' or 'rejected'
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const friendship = await Friendship.findById(friendshipId);
    if (!friendship) {
      return res.status(404).json({ message: 'Friendship not found' });
    }

    // If status is 'accepted', update both users' friend arrays
    if (status === 'accepted') {
      const userId = friendship.userId.toString();  // assuming userId is from the Friendship model
      const friendId = friendship.friendId.toString(); // assuming friendId is from the Friendship model

      // Find both users
      const user = await User.findById(userId);
      const friend = await User.findById(friendId);

      if (!user || !friend) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if they are already friends to avoid duplicate entries
      if (!user.friends.includes(friendId)) {
        user.friends.push(friendId);
        await user.save();
      }

      if (!friend.friends.includes(userId)) {
        friend.friends.push(userId);
        await friend.save();
      }
    }

    // Update the friendship status
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

    // Find all friendships where the status is 'pending' and the user is the recipient (friendId)
    const pendingRequests = await Friendship.find({
      userId: userId,
      status: 'pending'
    }).populate('userId', 'username email'); // Populates the requester user details

    // Send a 200 status code with a message if no pending requests are found
    if (!pendingRequests.length) {
      return res.status(200).json({ message: 'No pending friend requests found' });
    }

    // Return the pending requests if found
    res.status(200).json(pendingRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending friend requests', error });
  }
};



// Get all friends of a user
const getFriends = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find accepted friendships where the user is either the initiator or the friend
    const friendships = await Friendship.find({
      $or: [{ userId }, { friendId: userId }],
      status: 'accepted'
    }).populate('userId friendId'); // Populate user details if needed

    res.status(200).json(friendships);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching friends', error });
  }
};

// Delete a friendship
const deleteFriendship = async (req, res) => {
  try {
    const { friendshipId } = req.params;
    const friendship = await Friendship.findByIdAndDelete(friendshipId);

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
  getPendingFriendRequests
};
