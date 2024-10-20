const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    const {userId} =req.params;
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
      username: { $regex: new RegExp(username, 'i') }, // Create a RegExp object for the search
      _id: { $ne: userId } // Exclude the current user from the search results
    }).select('-password');

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
