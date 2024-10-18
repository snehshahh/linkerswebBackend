const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Reference to the User model
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Reference to the User model
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    },
    sharedLinks: [{
        linkId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Link' // Reference to the Links model
        },
        sharedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' // Reference to the user who shared the link
        }
    }],
    sharedCollections: [{
        collectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Collection' // Reference to the Collections model
        },
        sharedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' // Reference to the user who shared the collection
        }
    }]
});

module.exports = mongoose.model('Message', messageSchema);
