const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    mongoConnection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    systemInfo: {
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsage: process.memoryUsage(),
    }
  };
  
  try {
    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.message = error;
    res.status(503).json(healthcheck);
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB database:', mongoose.connection.db.databaseName);
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/tables', require('./routes/tables'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/chefs', require('./routes/chefs'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
