const Message = require('../models/MessageHistory');
const Link = require('../models/Links'); // Import the Links model
const Collection = require('../models/Collections'); // Import the Collections model
const User = require('../models/User'); // Adjust the path as needed


// Save a new message
exports.saveMessage = async (req, res) => {
    const { senderId, receiverIds, content, sharedLinkId, sharedCollectionId } = req.body;

    try {
        // Initialize an array to hold the created messages
        const messages = [];
        // Loop through each receiverId and create a message
        for (const receiverId of receiverIds) {
            const newMessage = new Message({
                senderId,
                receiverId,
                content,
                sharedLinks: sharedLinkId ? [{ linkId: sharedLinkId, sharedBy: senderId }] : [],
                sharedCollections: sharedCollectionId ? [{ collectionId: sharedCollectionId, sharedBy: senderId }] : []
            });

            // Save the message and push it to the messages array
            const savedMessage = await newMessage.save();
            messages.push(savedMessage);
        }

        res.status(201).json({ success: true, message: 'Messages sent successfully', data: messages });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to send messages', error: error.message });
    }
};

// Get a list of conversations for a user
exports.getConversationList = async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch messages where the user is either the sender or receiver
        const conversations = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        });

        // Extract unique user IDs
        const uniqueUserIds = new Set(
            conversations.flatMap(message => [
                message.senderId.toString() !== userId ? message.senderId.toString() : null,
                message.receiverId.toString() !== userId ? message.receiverId.toString() : null
            ]).filter(Boolean) // Remove null values
        );

        // Populate the user details for each unique user ID
        const userDetails = await User.find(
            { _id: { $in: Array.from(uniqueUserIds) } },
            'username'
        );

        res.status(200).json({ success: true, data: userDetails });
    } catch (error) {
        console.error('Error retrieving conversation list:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve conversation list', error: error.message });
    }
};


// Get message history between two users
exports.getMessagesWithLinksAndCollections = async (req, res) => {
    try {
        const { userId1, userId2 } = req.params;

        // Find messages between two users and populate sharedLinks and sharedCollections
        const messages = await Message.find({
            $or: [
                { senderId: userId1, receiverId: userId2 },
                { senderId: userId2, receiverId: userId1 }
            ]
        })
        .populate('sharedLinks.linkId') // Populate the link details from the Links model
        .populate('sharedLinks.sharedBy', 'name') // Populate the user who shared the link (only fetch the name)
        .populate('sharedCollections.collectionId') // Populate the collection details from the Collections model
        .populate('sharedCollections.sharedBy', 'name') // Populate the user who shared the collection (only fetch the name)
        .sort({ timestamp: -1 }); // Sort messages in chronological order
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages with links and collections:', error);
        res.status(500).json({ error: 'An error occurred while fetching the messages' });
    }
};

// Update message status
exports.updateMessageStatus = async (req, res) => {
    const { messageId } = req.params;
    const { status } = req.body;

    try {
        const updatedMessage = await Message.findByIdAndUpdate(messageId, { status }, { new: true });
        if (!updatedMessage) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }
        res.status(200).json({ success: true, data: updatedMessage });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update message status', error: error.message });
    }
};
