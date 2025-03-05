// controllers/userController.js
const  User  = require('../models/User');
const  Friendship = require('../models/Friendships');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// Validate email format
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate password strength
const validatePassword = (password) => {
  return password.length >= 8;
};

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ 
      username, 
      email, 
      password: hashedPassword 
    });

    res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { emailOrUsername, password } = req.body;
  try {
    const user = await User.findOne({ 
      where: { 
        [Op.or]: [
          { email: emailOrUsername }, 
          { username: emailOrUsername }
        ] 
      } 
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or username' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.setHeader('Authorization', `Bearer ${token}`);
    res.json({ message: 'Login successful', userId: user.id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.searchUsers = async (req, res) => {
  const { userId } = req.params;
  const { username } = req.query;

  try {
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ message: 'Invalid or missing username parameter' });
    }

    const users = await User.findAll({ 
      where: { 
        username: { [Op.iLike]: `%${username}%` }, 
        id: { [Op.ne]: userId } 
      }, 
      attributes: { exclude: ['password'] } 
    });

    const friendships = await Friendship.findAll({ 
      where: { 
        [Op.or]: [
          { user_id:userId }, 
          { friend_id: userId }
        ] 
      } 
    });

    const friendshipMap = new Map();
    friendships.forEach(f => {
      const otherUserId = f.user_id === userId ? f.friend_id : f.user_id;
      friendshipMap.set(otherUserId, f.status);
    });

    const usersWithFriendshipInfo = users.map(user => ({
      ...user.dataValues,
      isFriend: friendshipMap.get(user.id) === 'accepted',
      isRequestSent: friendshipMap.get(user.id) === 'pending' && friendships.some(f => f.user_id === userId && f.friend_id === user.id),
      isRequestReceived: friendshipMap.get(user.id) === 'pending' && friendships.some(f => f.user_id === user.id && f.friend_id === userId),
      mutualFriendsCount: 0, // Simplified; add logic for mutual friends if needed
    }));

    res.json({ users: usersWithFriendshipInfo });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, profilePicture, bio } = req.body;

    // Validate email if provided
    if (email && !validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const [updated] = await User.update(
      { username, email, profilePicture, bio, updatedAt: new Date() }, 
      { where: { id: userId }, returning: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await User.findByPk(userId, { attributes: { exclude: ['password'] } });
    res.json({ message: 'Profile updated successfully', updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};