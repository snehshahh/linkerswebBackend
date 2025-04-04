const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Collection = sequelize.define('Collection', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  shared_with: {
    type: DataTypes.ARRAY(DataTypes.UUID),
  },
  links: {
    type: DataTypes.ARRAY(DataTypes.UUID),
  },
  isPublic: { // New field
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
  tableName: 'collections',
  timestamps: false,
});

module.exports = Collection;