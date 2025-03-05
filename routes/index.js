// models/index.js
const sequelize = require('../config/db');
const User = require('../models/User');
const UserImpression = require('../models/UserImpression');
const Link = require('../models/Links');
const Collection = require('../models/Collections');
const Notification = require('../models/Notifications');
const Message = require('../models/MessageHistory');
const Friendship = require('../models/Friendships');

const syncModels = async () => {
  await sequelize.sync({ alter: true }); // Use { force: true } for testing, but be cautious in production
  console.log('Database synchronized');
};

syncModels().catch(console.error);

module.exports = { User, UserImpression, Link, Collection, Notification, Message, Friendship };