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
    // Fetch collections for the given userId
    const collections = await Collection.find({ userId });

    // Populate links and sharedWith fields only if the links array is not empty
    for (const collection of collections) {
      // Ensure the links field is always an array, even if it's empty
      collection.links = collection.links || [];
      if (collection.links.length > 0) {
        await collection.populate('links sharedWith').execPopulate();
      }
    }

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

// Remove a link from a collection
const removeLinkFromCollection = async (req, res) => {
  try {
    const { collectionId } = req.params; 
    const { linkId } = req.body;

    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    // Check if the link exists in the collection
    const linkIndex = collection.links.indexOf(linkId);
    if (linkIndex === -1) {
      return res.status(400).json({ message: 'Link not found in the collection' });
    }

    // Remove the link from the collection
    collection.links.splice(linkIndex, 1);

    await collection.save();

    res.status(200).json({ message: 'Link removed from collection successfully', collection });
  } catch (error) {
    res.status(500).json({ message: 'Error removing link from collection', error });
  }
};


module.exports = {
  createCollection,
  getCollectionsByUser,
  shareCollection,
  deleteCollection,
  removeLinkFromCollection,
  updateCollection
};
