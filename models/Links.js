const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true
  },
  url: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  boolImp: { // New boolean field
    type: Boolean,
    default: false // You can set the default value to false or true as needed
  }
});

// Update the updatedAt field on save
LinkSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updatedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model('Link', LinkSchema);
