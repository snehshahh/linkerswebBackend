const Link = require('../models/Links');

// Create a new link
const createLink = async (req, res) => {
  try {
    const { userId, url, description, tags, sharedWith } = req.body;
    const newLink = new Link({ userId, url, description, tags, sharedWith });
    await newLink.save();
    res.status(201).json(newLink);
  } catch (error) {
    res.status(500).json({ message: 'Error creating link', error });
  }
};

// Share a link with other users
const shareLink = async (req, res) => {
  try {
    const { linkId, userIds } = req.body; // `userIds` is an array of ObjectIds
    const link = await Link.findById(linkId);
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }
    link.sharedWith = [...new Set([...link.sharedWith, ...userIds])]; // Ensure unique user IDs
    await link.save();
    res.status(200).json(link);
  } catch (error) {
    res.status(500).json({ message: 'Error sharing link', error });
  }
};

// Delete a link
const deleteLink = async (req, res) => {
  try {
    const { linkId } = req.params;
    const link = await Link.findByIdAndDelete(linkId);
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }
    res.status(200).json({ message: 'Link deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting link', error });
  }
};

// Update link description
const updateDescription = async (req, res) => {
  try {
    const { linkId } = req.params;
    const { description } = req.body;
    const link = await Link.findById(linkId);
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }
    link.description = description;
    await link.save();
    res.status(200).json(link);
  } catch (error) {
    res.status(500).json({ message: 'Error updating description', error });
  }
};

// Get all links for a user
const getUserLinks = async (req, res) => {
  try {
    const { userId } = req.params;
    const links = await Link.find({ userId });
    res.status(200).json(links);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving links', error });
  }
};

module.exports = {
  createLink,
  shareLink,
  deleteLink,
  updateDescription,
  getUserLinks
};
