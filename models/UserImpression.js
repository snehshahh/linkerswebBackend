const mongoose = require('mongoose');

const UserImpressionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
    index: true // Index for faster queries by userId
  },
  linkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Link', // Reference to the Link model
    required: true,
    index: true // Index for faster queries by linkId
  },  
  timeSpent: {
    type: Number, // Time spent on the link in seconds (or your preferred unit)
    required: true,
    default: 0
  },
  liked: {
    type: Boolean, // Whether the user liked the link
    required: true,
    default: false
  },
  shared: {
    type: Boolean, // Whether the user shared the link
    required: true,
    default: false
  },
  click: {
    type: Boolean, // Whether the user clicked the link
    required: true,
    default: false
  },
  timestamp: {
    type: Date, // When the impression occurred
    default: Date.now
  }
});

// Compound index for queries involving both userId and linkId
UserImpressionSchema.index({ userId: 1, linkId: 1 });

module.exports = mongoose.model('UserImpression', UserImpressionSchema);