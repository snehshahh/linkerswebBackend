const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Link = sequelize.define('Link', {
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
  },
  shared_with: {
    type: DataTypes.ARRAY(DataTypes.UUID),
  },
  bool_imp: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  upvote: { // New field for likes (alternative naming)
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  downvote: { // New field for dislikes (alternative naming)
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  created_at: {
    type: DataTypes.DATE,
  },
  warning:{
    type:DataTypes.STRING
  }
}, {
  tableName: 'links',
  timestamps: false,
});

module.exports = Link;