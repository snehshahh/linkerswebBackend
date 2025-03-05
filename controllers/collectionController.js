// controllers/collectionController.js
const { Collection } = require('../models/Collections');

const createCollection = async (req, res) => {
  try {
    const { userId, name, description, links, sharedWith } = req.body;
    const newCollection = await Collection.create({ collectionId: `collection_${Date.now()}`, userId, name, description, links, sharedWith });
    res.status(201).json(newCollection);
  } catch (error) {
    res.status(500).json({ message: 'Error creating collection', error });
  }
};

const getCollectionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const collections = await Collection.findAll({ where: { userId } });
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching collections', error });
  }
};

const shareCollection = async (req, res) => {
  try {
    const { collectionId, userIds } = req.body;
    const collection = await Collection.findByPk(collectionId);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    collection.sharedWith = [...new Set([...collection.sharedWith, ...userIds])];
    await collection.save();
    res.status(200).json(collection);
  } catch (error) {
    res.status(500).json({ message: 'Error sharing collection', error });
  }
};

const deleteCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const collection = await Collection.destroy({ where: { collectionId } });
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    res.status(200).json({ message: 'Collection deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting collection', error });
  }
};

const updateCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { name, description } = req.body;
    const collection = await Collection.findByPk(collectionId);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    if (name) collection.name = name;
    if (description) collection.description = description;
    await collection.save();
    res.status(200).json(collection);
  } catch (error) {
    res.status(500).json({ message: 'Error updating collection', error });
  }
};

const removeLinkFromCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { linkId } = req.body;
    const collection = await Collection.findByPk(collectionId);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    collection.links = collection.links.filter(id => id !== linkId);
    await collection.save();
    res.status(200).json({ message: 'Link removed from collection successfully', collection });
  } catch (error) {
    res.status(500).json({ message: 'Error removing link from collection', error });
  }
};

const addLinkToCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { linkId } = req.body;
    const collection = await Collection.findByPk(collectionId);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    if (!collection.links.includes(linkId)) {
      collection.links.push(linkId);
      await collection.save();
    }
    res.status(200).json({ message: 'Link added to collection successfully', collection });
  } catch (error) {
    res.status(500).json({ message: 'Error adding link to collection', error });
  }
};

module.exports = {
  createCollection,
  getCollectionsByUser,
  shareCollection,
  deleteCollection,
  updateCollection,
  removeLinkFromCollection,
  addLinkToCollection,
};