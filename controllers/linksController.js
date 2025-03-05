const { Link } = require('../models/Links');
const { Op } = require('sequelize');

// Validate URL format
const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const createLink = async (req, res) => {
  try {
    const { userId, url, description, tags, sharedWith } = req.body;

    // Input validation
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!url || !validateUrl(url)) {
      return res.status(400).json({ message: 'Invalid URL' });
    }

    const newLink = await Link.create({ 
      linkId: `link_${Date.now()}`, 
      userId, 
      url, 
      description: description || '', 
      tags: tags || [], 
      sharedWith: sharedWith || [], 
      boolImp: false 
    });

    res.status(201).json(newLink);
  } catch (error) {
    console.error('Error creating link:', error);
    res.status(500).json({ message: 'Error creating link', error: error.message });
  }
};

const shareLink = async (req, res) => {
  try {
    const { linkId, userIds } = req.body;

    // Input validation
    if (!linkId) {
      return res.status(400).json({ message: 'Link ID is required' });
    }

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'Invalid user IDs' });
    }

    const link = await Link.findByPk(linkId);
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    // Merge and deduplicate shared users
    const updatedSharedWith = [...new Set([...link.sharedWith, ...userIds])];
    
    link.sharedWith = updatedSharedWith;
    await link.save();

    res.status(200).json(link);
  } catch (error) {
    console.error('Error sharing link:', error);
    res.status(500).json({ message: 'Error sharing link', error: error.message });
  }
};

const deleteLink = async (req, res) => {
  try {
    const { linkId } = req.params;

    // Input validation
    if (!linkId) {
      return res.status(400).json({ message: 'Link ID is required' });
    }

    const deletedCount = await Link.destroy({ where: { linkId } });
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Link not found' });
    }

    res.status(200).json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(500).json({ message: 'Error deleting link', error: error.message });
  }
};

const updateLinkDetails = async (req, res) => {
  try {
    const { linkId } = req.params;
    const { description, boolImp, tags } = req.body;

    // Input validation
    if (!linkId) {
      return res.status(400).json({ message: 'Link ID is required' });
    }

    const link = await Link.findByPk(linkId);
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    // Update fields only if they are provided
    if (description !== undefined) link.description = description;
    if (boolImp !== undefined) link.boolImp = boolImp;
    if (tags !== undefined) link.tags = tags;

    await link.save();
    res.status(200).json(link);
  } catch (error) {
    console.error('Error updating link details:', error);
    res.status(500).json({ message: 'Error updating link details', error: error.message });
  }
};

const getUserLinks = async (req, res) => {
  try {
    const { userId } = req.params;
    const { search, tag, isImportant } = req.query;

    // Input validation
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Build dynamic where clause
    const whereClause = { userId };

    if (search) {
      whereClause[Op.or] = [
        { description: { [Op.iLike]: `%${search}%` } },
        { url: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (tag) {
      whereClause.tags = { [Op.contains]: [tag] };
    }

    if (isImportant !== undefined) {
      whereClause.boolImp = isImportant === 'true';
    }

    const links = await Link.findAll({ 
      where: whereClause,
      order: [['createdAt', 'DESC']] // Latest links first
    });

    res.status(200).json(links);
  } catch (error) {
    console.error('Error retrieving links:', error);
    res.status(500).json({ message: 'Error retrieving links', error: error.message });
  }
};

module.exports = {
  createLink,
  shareLink,
  deleteLink,
  updateLinkDetails,
  getUserLinks,
};