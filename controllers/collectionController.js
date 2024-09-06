const Collection = require('../models/Collections');

// Create a new collection
const createCollection = async (req, res) => {
  try {
    const { userId, name, description, links, sharedWith } = req.body;
    const newCollection = new Collection({ userId, name, description, links, sharedWith });
    await newCollection.save();
    res.status(201).json(newCollection);
  } catch (error) {
    res.status(500).json({ message: 'Error creating collection', error });
  }
};

// Get all collections for a user
const getCollectionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const collections = await Collection.find({ userId }).populate('links sharedWith');
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching collections', error });
  }
};

// Share a collection with other users
const shareCollection = async (req, res) => {
  try {
    const { collectionId, userIds } = req.body; // `userIds` is an array of ObjectIds
    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    collection.sharedWith = [...new Set([...collection.sharedWith, ...userIds])]; // Ensure unique user IDs
    await collection.save();
    res.status(200).json(collection);
  } catch (error) {
    res.status(500).json({ message: 'Error sharing collection', error });
  }
};

// Delete a collection
const deleteCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const collection = await Collection.findByIdAndDelete(collectionId);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    res.status(200).json({ message: 'Collection deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting collection', error });
  }
};

// Update collection name or description
const updateCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { name, description } = req.body;
    const collection = await Collection.findById(collectionId);
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

module.exports = {
  createCollection,
  getCollectionsByUser,
  shareCollection,
  deleteCollection,
  updateCollection
};
