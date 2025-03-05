// models/UserImpression.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserImpression = sequelize.define('UserImpression', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  linkId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timeSpent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  liked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  shared: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  click: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user_impressions',
  timestamps: false,
});

module.exports = UserImpression;