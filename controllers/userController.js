const User = require('../models/User');
const { uploadToDrive } = require('../config/googleDrive');
const bcrypt = require('bcryptjs');
const path = require('path');
const jwt = require('jsonwebtoken');
const Friendship = require('../models/Friendships')
const fs = require('fs');


// Register a new user
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', newUser });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  const { emailOrUsername, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.setHeader('Authorization', `Bearer ${token}`);

    // Encrypt the response data
    const responseData = {
      message: 'Login successful',
      userId: user._id
    };
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, profilePicture, bio } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          username,
          email,
          profilePicture,
          bio,
          updatedAt: Date.now()
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Search for users by username
exports.searchUsers = async (req, res) => {
  const { userId } = req.params; // The ID of the logged-in user
  const { username } = req.query; // The username to search for

  try {
    // Ensure that the username parameter is a string
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ message: 'Invalid or missing username parameter' });
    }

    // Find users whose usernames contain the search term, excluding the current user
    const users = await User.find({
      username: { $regex: new RegExp(username, 'i') },
      _id: { $ne: userId }
    }).select('-password');

    // Fetch all friendships related to the current user
    const friendships = await Friendship.find({
      $or: [
        { userId: userId },
        { friendId: userId }
      ]
    });

    // Create a map of friendships for quick lookup
    const friendshipMap = new Map();
    friendships.forEach(friendship => {
      const otherUserId = friendship.userId.equals(userId) ? friendship.friendId : friendship.userId;
      friendshipMap.set(otherUserId.toString(), friendship.status);
    });

    // Prepare the response with additional friendship information
    const usersWithFriendshipInfo = await Promise.all(users.map(async (user) => {
      const friendshipStatus = friendshipMap.get(user._id.toString());
      const isFriend = friendshipStatus === 'accepted';
      const isRequestSent = friendshipStatus === 'pending' && friendships.some(f => f.userId.equals(userId) && f.friendId.equals(user._id));
      const isRequestReceived = friendshipStatus === 'pending' && friendships.some(f => f.userId.equals(user._id) && f.friendId.equals(userId));

      // Calculate mutual friends
      const userFriendships = await Friendship.find({
        $or: [
          { userId: user._id, status: 'accepted' },
          { friendId: user._id, status: 'accepted' }
        ]
      });

      const userFriendIds = userFriendships.map(f =>
        f.userId.equals(user._id) ? f.friendId : f.userId
      );

      const mutualFriendships = friendships.filter(f =>
        f.status === 'accepted' && userFriendIds.some(id => id.equals(f.userId) || id.equals(f.friendId))
      );

      // Fetch mutual friends' details
      const mutualFriendsDetails = await User.find({
        _id: { $in: mutualFriendships.map(f => f.userId.equals(userId) ? f.friendId : f.userId) }
      }).select('_id username profilePicture');

      return {
        ...user.toObject(),
        isFriend,
        isRequestSent,
        isRequestReceived,
        mutualFriendsCount: mutualFriendsDetails.length,
        mutualFriends: mutualFriendsDetails
      };
    }));

    res.json({ users: usersWithFriendshipInfo });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
