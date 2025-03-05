// models/Links.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Link = sequelize.define('Link', {
  linkId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  sharedWith: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  boolImp: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'links',
  timestamps: false,
});

module.exports = Link;