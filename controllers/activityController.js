const ActivityLog = require('../models/ActivityLog');

// Create an activity log
const createActivityLog = async (userId, activityType, description, relatedLinkId = null, relatedCollectionId = null) => {
  try {
    const newLog = new ActivityLog({
      userId,
      activityType,
      description,
      relatedLinkId,
      relatedCollectionId
    });
    await newLog.save();
    return newLog;
  } catch (error) {
    console.error('Error creating activity log:', error);
    throw error;
  }
};

// Get all activity logs for a user
const getUserActivityLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const logs = await ActivityLog.find({ userId })
      .sort({ createdAt: -1 })
      .populate('relatedLinkId')
      .populate('relatedCollectionId');
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving activity logs', error });
  }
};

module.exports = {
  createActivityLog,
  getUserActivityLogs
};
