import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import connectDB from '../../api/config/database.js';

// Import API routes
import authRoutes from '../../api/routes/auth.ts';
import profileRoutes from '../../api/routes/profile.ts';
import uploadRoutes from '../../api/routes/upload.ts';

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://st10482726photoshare.netlify.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize database connection
let dbInitialized = false;

async function initializeDatabase() {
  if (!dbInitialized) {
    try {
      await connectDB();
      console.log('Database connected successfully');
      global.mongoDBAvailable = true;
      dbInitialized = true;
    } catch (error) {
      console.error('Database connection failed:', error);
      global.mongoDBAvailable = false;
    }
  }
}

// Middleware to ensure database is initialized
app.use(async (req, res, next) => {
  await initializeDatabase();
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongodb: global.mongoDBAvailable || false
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Export the serverless function
export const handler = serverless(app);