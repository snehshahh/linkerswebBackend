// controllers/userImpressionController.js
const { UserImpression } = require('../models/UserImpression');
const axios = require('axios');
require('dotenv').config();

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:5000/api';

exports.saveImpression = async (req, res) => {
  const { userId, linkId, timeSpent, liked, shared, click } = req.body;

  try {
    const impression = await UserImpression.create({ userId, linkId, timeSpent, liked, shared, click });
    res.status(201).json({ message: 'Impression logged successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log impression', details: error.message });
  }
};

exports.getRecommendations = async (req, res) => {
  const { user_id, num_links = 5, num_collections = 2 } = req.query;
  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id parameter' });
  }

  try {
    const numLinks = parseInt(num_links, 10);
    const numCollections = parseInt(num_collections, 10);
    if (isNaN(numLinks) || isNaN(numCollections)) {
      throw new Error('Invalid number of recommendations');
    }

    const response = await axios.get(`${PYTHON_API_URL}/recommendations`, {
      params: { user_id, num_links: numLinks, num_collections: numCollections },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
};

exports.refreshRecommendations = async (req, res) => {
  try {
    const response = await axios.post(`${PYTHON_API_URL}/refresh`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to refresh recommendations' });
  }
};