const UserImpression = require('../models/UserImpression')

exports.saveImpression = async (req, res) => {
    const { userId, linkId, timeSpent, liked, shared, click } = req.body;
  
    try {
      const impression = new UserImpression({
        userId,
        linkId,
        timeSpent,
        liked: liked || false,
        shared: shared || false,
        click: click || false
      });
      await impression.save();
      res.status(201).json({ message: 'Impression logged successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to log impression', details: error.message });
    }
  };
  