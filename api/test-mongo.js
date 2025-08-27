import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mongoURI = process.env.MONGODB_URI;
console.log('Testing MongoDB connection...');
console.log('URI:', mongoURI ? 'Set' : 'Not set');

mongoose.connect(mongoURI)
  .then(() => {
    console.log('✅ MongoDB connection successful!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  });

// Timeout after 10 seconds
setTimeout(() => {
  console.error('❌ Connection timeout after 10 seconds');
  process.exit(1);
}, 10000);