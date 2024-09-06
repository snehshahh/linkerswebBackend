require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Use the collection routes


// Import routes
const userRoutes = require('./routes/userRoutes');
const linkRoutes = require('./routes/linksRoutes');
const collectionRouter = require('./routes/collectionRoute');
const friendshipRouter = require('./routes/friendshipRoute');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/collections', collectionRouter);
app.use('/api/friends', friendshipRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
