const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // The user who is receiving the notification
    required: true
  },
  type: {
    type: String,
    enum: ['friend_request', 'link_shared', 'collection_shared'], // Type of notification
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Reference to the user associated with the notification
  },
  relatedLinkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Link' // Optional reference to a link related to the notification
  },
  relatedCollectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection' // Optional reference to a collection related to the notification
  },
  isRead: {
    type: Boolean,
    default: false // Whether the notification has been read
  },
  createdAt: {
    type: Date,
    default: Date.now // Timestamp when the notification was created
  }
});

module.exports = mongoose.model('Notification', NotificationSchema);
