// server.js
const express = require('express');
const app = express();
require('dotenv').config();

// Middleware
app.use(express.json());

// Routes
const userImpressionRoute = require('./routes/userImpressionRoute');
const linksRoute = require('./routes/linksRoutes');
const collectionRoute = require('./routes/collectionRoute');
const notificationRoute = require('./routes/notificationRoute');
const messageHistoryRoute = require('./routes/messageHistoryRoute');
const friendshipRoute = require('./routes/friendshipRoute');
const userRoute = require('./routes/userRoutes');

app.use('/api', userImpressionRoute);
app.use('/api', linksRoute);
app.use('/api', collectionRoute);
app.use('/api', notificationRoute);
app.use('/api', messageHistoryRoute);
app.use('/api', friendshipRoute);
app.use('/api', userRoute);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});