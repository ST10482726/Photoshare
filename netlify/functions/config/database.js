import mongoose from 'mongoose';

const connectDB = async (retries = 3) => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/photoshare';
  
  // Initialize MongoDB availability flag
  global.mongoDBAvailable = true;
  
  console.log('Attempting to connect to MongoDB...');
  console.log('Connection URI:', mongoURI.replace(/://([^:]+):([^@]+)@/, '://***:***@'));
  
  // MongoDB Atlas compatible options
  const options = {
    serverSelectionTimeoutMS: 30000, // 30 seconds
    socketTimeoutMS: 45000, // 45 seconds
    connectTimeoutMS: 30000, // 30 seconds
    maxPoolSize: 10,
    minPoolSize: 1,
    maxIdleTimeMS: 30000
  };
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Connection attempt ${attempt}/${retries}...`);
      await mongoose.connect(mongoURI, {
        ...options,
        family: 4 // Use IPv4
      });
      console.log('✅ MongoDB connected successfully');
      return;
    } catch (error) {
      console.error(`❌ Connection attempt ${attempt} failed:`, error.message);
      
      if (attempt === retries) {
        console.error('All connection attempts failed. Server will start without MongoDB...');
        console.error('API will use fallback responses until connection is restored.');
        // Set a flag to indicate MongoDB is unavailable
        global.mongoDBAvailable = false;
        // Continue retrying in background
        setTimeout(() => {
          console.log('Retrying MongoDB connection in background...');
          connectDB(3).then(() => {
            global.mongoDBAvailable = true;
            console.log('MongoDB reconnected successfully');
          }).catch(() => {
            console.log('Background reconnection failed, will retry again...');
          });
        }, 30000); // Retry after 30 seconds
        return;
      }
      
      console.log(`Retrying in 5 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
  global.mongoDBAvailable = true;
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

export default connectDB;