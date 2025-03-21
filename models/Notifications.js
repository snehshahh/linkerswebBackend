const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  related_user_id: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  related_link_id: {
    type: DataTypes.UUID,
    references: {
      model: 'links',
      key: 'id',
    },
  },
  related_collection_id: {
    type: DataTypes.UUID,
    references: {
      model: 'collections',
      key: 'id',
    },
  },
  created_at: {
    type: DataTypes.DATE,
  },
  is_read: {
    type: DataTypes.BOOLEAN,
  },
}, {
  tableName: 'notifications',
  timestamps: false,
});

module.exports = Notification;