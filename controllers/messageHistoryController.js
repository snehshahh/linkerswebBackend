// controllers/messageHistoryController.js
const Message = require('../models/MessageHistory');
const Link = require('../models/Links');
const Collection = require('../models/Collections');
const User = require('../models/User');

exports.saveMessage = async (req, res) => {
  const { sender_id,receiver_id,content, shared_link_id, shared_colleciton_id } = req.body;

  try {
    const messages = [];
    const newMessage = await Message.create({ sender_id,receiver_id,content, shared_link_id, shared_colleciton_id });
    messages.push(newMessage);
    res.status(201).json({ success: true, message: 'Messages sent successfully', data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send messages', error: error.message });
  }
};

exports.getConversationList = async (req, res) => {
  const { userId } = req.params;

  try {
    const conversations = await Message.findAll({
      where: { $or: [{ sender_id: userId }, { receiver_id: userId }] },
      attributes: ['sender_id', 'receiver_id'],
      group: ['sender_id', 'receiver_id'],
    });

    const uniqueUserIds = [...new Set(conversations.flatMap(m => [m.senderId, m.receiverId].filter(id => id !== userId)))];
    const userDetails = await User.findAll({ where: { id: uniqueUserIds }, attributes: ['id', 'username'] });
    res.status(200).json({ success: true, data: userDetails });
  } catch (error) {
    console.error('Error retrieving conversation list:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve conversation list', error: error.message });
  }
};

exports.getMessagesWithLinksAndCollections = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const messages = await Message.findAll({
      where: {
        $or: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      order: [['timestamp', 'DESC']],
    });

    const messagesWithDetails = await Promise.all(messages.map(async msg => {
      let linkDetails = null, collectionDetails = null;
      if (msg.sharedLinkId) {
        linkDetails = await Link.findByPk(msg.sharedLinkId);
      }
      if (msg.sharedCollectionId) {
        collectionDetails = await Collection.findByPk(msg.sharedCollectionId);
      }
      return {
        ...msg.dataValues,
        sharedLink: linkDetails,
        sharedCollection: collectionDetails,
      };
    }));

    res.status(200).json(messagesWithDetails);
  } catch (error) {
    console.error('Error fetching messages with links and collections:', error);
    res.status(500).json({ error: 'An error occurred while fetching the messages' });
  }
};

exports.updateMessageStatus = async (req, res) => {
  const { messageId } = req.params;
  const { status } = req.body;

  try {
    const message = await Message.findByPk(messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    message.status = status;
    await message.save();
    res.status(200).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update message status', error: error.message });
  }
};