const Collection= require('../models/Collections');
const User  = require('../models/User');
const  Link  = require('../models/Links');
const { Op } = require('sequelize');

const createCollection = async (req, res) => {
  try {
    const { userId, name, description, sharedWith, links } = req.body;

    // Input validation
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'Collection name is required and must be a non-empty string' });
    }

    // Validate user existence
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    if (sharedWith) {
      const users = await User.findAll({ where: { id: sharedWith } });
      if (users.length !== sharedWith.length) {
        return res.status(400).json({ message: 'One or more shared user IDs are invalid' });
      }
    }

    // Validate links (optional)
    if (links && (!Array.isArray(links) || links.length === 0)) {
      return res.status(400).json({ message: 'links must be a non-empty array' });
    }

    if (links) {
      const existingLinks = await Link.findAll({ where: { id: links } });
      if (existingLinks.length !== links.length) {
        return res.status(400).json({ message: 'One or more link IDs are invalid' });
      }
    }

    const newCollection = await Collection.create({
      user_id: userId,
      name,
      description: description || '',
      shared_with: sharedWith || [],
      links: links || [],
    });

    res.status(201).json(newCollection);
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({ message: 'Error creating collection', error: error.message });
  }
};

const addLinkToCollection = async (req, res) => {
  try {
    const { collectionId, linkId } = req.body;

    if (!collectionId) {
      return res.status(400).json({ message: 'Collection ID is required' });
    }

    if (!linkId) {
      return res.status(400).json({ message: 'Link ID is required' });
    }

    const collection = await Collection.findByPk(collectionId);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    const link = await Link.findByPk(linkId);
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    // Add link to the collection's links array
    const updatedLinks = Array.isArray(collection.links) ? [...new Set([...collection.links, linkId])] : [linkId];
    await Collection.update(
      { links: updatedLinks },
      { where: { id: collectionId } }
    );

    const updatedCollection = await Collection.findByPk(collectionId);
    res.status(200).json(updatedCollection);
  } catch (error) {
    console.error('Error adding link to collection:', error);
    res.status(500).json({ message: 'Error adding link to collection', error: error.message });
  }
};

const shareCollection = async (req, res) => {
  try {
    const { collectionId, userIds } = req.body;

    if (!collectionId) {
      return res.status(400).json({ message: 'Collection ID is required' });
    }

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'Invalid user IDs' });
    }

    const collection = await Collection.findByPk(collectionId);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    const users = await User.findAll({ where: { id: userIds } });
    if (users.length !== userIds.length) {
      return res.status(400).json({ message: 'One or more user IDs are invalid' });
    }

    const updatedSharedWith = Array.isArray(collection.shared_with)
      ? [...new Set([...collection.shared_with, ...userIds])]
      : [...userIds];

    await Collection.update(
      { shared_with: updatedSharedWith },
      { where: { id: collectionId } }
    );

    const updatedCollection = await Collection.findByPk(collectionId);
    res.status(200).json(updatedCollection);
  } catch (error) {
    console.error('Error sharing collection:', error);
    res.status(500).json({ message: 'Error sharing collection', error: error.message });
  }
};

const getUserCollections = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const collections = await Collection.findAll({
      where: { user_id: userId },
      order: [['name', 'ASC']],
    });

    res.status(200).json(collections);
  } catch (error) {
    console.error('Error retrieving collections:', error);
    res.status(500).json({ message: 'Error retrieving collections', error: error.message });
  }
};

const updateCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { name, description,upvote,downvote,warning } = req.body;

    if (!collectionId) {
      return res.status(400).json({ message: 'Collection ID is required' });
    }

    const collection = await Collection.findByPk(collectionId);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    const updates = {};
    if (name) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (upvote !== undefined) updates.upvote = upvote;
    if (downvote !== undefined) updates.downvote = downvote;
    if (warning !== undefined) updates.warning = warning;

    await Collection.update(updates, { where: { id: collectionId } });

    const updatedCollection = await Collection.findByPk(collectionId);
    res.status(200).json(updatedCollection);
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({ message: 'Error updating collection', error: error.message });
  }
};

const deleteCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;

    if (!collectionId) {
      return res.status(400).json({ message: 'Collection ID is required' });
    }

    const deletedCount = await Collection.destroy({ where: { id: collectionId } });
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.status(200).json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({ message: 'Error deleting collection', error: error.message });
  }
};

const getPublicCollections = async (req, res) => {
  try {
    const publicCollections = await Collection.findAll({
      where: { is_public: true },
    });

    res.status(200).json(publicCollections);
  } catch (error) {
    console.error('Error retrieving public collections:', error);
    res.status(500).json({ message: 'Error retrieving public collections', error: error.message });
  }
};


module.exports = {
  createCollection,
  addLinkToCollection,
  shareCollection,
  getUserCollections,
  updateCollection,
  deleteCollection,
  getPublicCollections,
};