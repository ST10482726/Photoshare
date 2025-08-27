import app from './app.js';
import connectDB from './config/database.js';

const PORT = process.env.PORT || 3002;
console.log('Using PORT:', PORT);
console.log('Environment variables:', { PORT: process.env.PORT, NODE_ENV: process.env.NODE_ENV });

async function startServer() {
  // Start the HTTP server first
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
  });
  
  // Connect to MongoDB (non-blocking)
  try {
    await connectDB();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed, but server is still running:', error.message);
    // MongoDB will retry in background via the connectDB retry logic
  }
}

startServer();

