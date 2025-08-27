import mongoose from 'mongoose';

const connectDB = async (retries = 3): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/photoshare';
  
  console.log('Attempting to connect to MongoDB...');
  console.log('Connection URI:', mongoURI.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@'));
  
  const options = {
    serverSelectionTimeoutMS: 15000, // 15 seconds
    socketTimeoutMS: 30000, // 30 seconds
    connectTimeoutMS: 15000, // 15 seconds
    family: 4, // Use IPv4, skip trying IPv6
    maxPoolSize: 10,
    retryWrites: true,
    w: 'majority' as const,
    tls: true,
    tlsInsecure: true
  };
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Connection attempt ${attempt}/${retries}...`);
      await mongoose.connect(mongoURI, options);
      console.log('✅ MongoDB connected successfully');
      return;
    } catch (error) {
      console.error(`❌ Connection attempt ${attempt} failed:`, error.message);
      
      if (attempt === retries) {
         console.error('All connection attempts failed. Will continue retrying in background...');
         console.error('Full error details:', JSON.stringify(error, null, 2));
         // Don't exit, let the server start and retry connection later
         setTimeout(() => connectDB(3), 10000); // Retry after 10 seconds
         return;
       }
      
      console.log(`Retrying in 3 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
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