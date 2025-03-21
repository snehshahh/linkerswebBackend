const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserImpression = sequelize.define('UserImpression', {
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
  link_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'links',
      key: 'id',
    },
  },
  time_spent: {
    type: DataTypes.INTEGER,
  },
  liked: {
    type: DataTypes.BOOLEAN,
  },
  shared: {
    type: DataTypes.BOOLEAN,
  },
  click: {
    type: DataTypes.BOOLEAN,
  },
  timestamp: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'user_impressions',
  timestamps: false,
});

module.exports = UserImpression;