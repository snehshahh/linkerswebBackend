const mongoose = require('mongoose');

const SharedLinkSchema = new mongoose.Schema({
  linkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Link', // Reference to the Link model
    required: true
  },
  sharedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ID of the user sharing the link
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ID of the user receiving the link
    required: true
  },
  sharedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SharedLink', SharedLinkSchema);
