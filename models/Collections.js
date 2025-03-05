// models/Collections.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Collection = sequelize.define('Collection', {
  collectionId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  sharedWith: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  links: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
}, {
  tableName: 'collections',
  timestamps: false,
});

module.exports = Collection;