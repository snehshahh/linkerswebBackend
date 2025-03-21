const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  sender_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  receiver_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shared_link_id: {
    type: DataTypes.UUID,
    references: {
      model: 'links',
      key: 'id',
    },
  },
  shared_collection_id: {
    type: DataTypes.UUID,
    references: {
      model: 'collections',
      key: 'id',
    },
  },
  timestamp: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'unread', // Kept default as it’s necessary
  },
}, {
  tableName: 'message_history',
  timestamps: false,
});

module.exports = Message;