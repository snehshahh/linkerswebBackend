require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const userRoutes = require('./routes/userRoutes');
const linkRoutes = require('./routes/linksRoutes');
const collectionRouter = require('./routes/collectionRoute');
const friendshipRouter = require('./routes/friendshipRoute');
const notificationRouter = require('./routes/notificationRoute');
const activityRouter = require('./routes/activityLogRoute');
const messageHistoryRoutes = require('./routes/messageHistoryRoute');

const app = express();
app.use(cors({
  origin: '*', // Be more specific in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/collections', collectionRouter);
app.use('/api/friends', friendshipRouter);
app.use('/api/notification', notificationRouter);
app.use('/api/activity', activityRouter);
app.use('/api/message-history', messageHistoryRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
