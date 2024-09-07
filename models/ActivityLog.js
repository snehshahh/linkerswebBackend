const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activityType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  relatedLinkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Link',
    required: false
  },
  relatedCollectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
