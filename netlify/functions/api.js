const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('./routes/auth.js');
const profileRoutes = require('./routes/profile.js');
const uploadRoutes = require('./routes/upload.js');
const connectDB = require('./config/database.js');

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:4173',
    'https://st10482726photoshare.netlify.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize MongoDB connection
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    await connectDB();
    isConnected = true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Don't throw error, let the app continue with fallback mode
  }
};

// Routes
app.use('/api/auth', authRoutes.default || authRoutes);
app.use('/api/profile', profileRoutes.default || profileRoutes);
app.use('/api/upload', uploadRoutes.default || uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Netlify Function handler
const handler = async (event, context) => {
  // Connect to database on each function call
  await connectToDatabase();
  
  // Create serverless handler
  const serverlessHandler = serverless(app);
  
  return await serverlessHandler(event, context);
};

module.exports = { handler };