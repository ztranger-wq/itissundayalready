const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGO_URI exists
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI is not defined in environment variables');
      console.log('📝 Please create a .env file in the backend directory with MONGO_URI');
      return;
    }

    console.log('🔄 Connecting to MongoDB...');
    console.log('📍 MongoDB URI:', process.env.MONGO_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
    
    // Remove deprecated options - they're not needed in mongoose 6+
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`🏠 Host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
  } catch (err) {
    console.error('❌ MongoDB Connection Error:');
    console.error('📋 Error Message:', err.message);
    
    if (err.message.includes('ECONNREFUSED')) {
      console.log('💡 Possible solutions:');
      console.log('   1. Make sure MongoDB is running locally');
      console.log('   2. Check if MongoDB service is started');
      console.log('   3. Verify the connection string in .env file');
    }
    
    // Don't exit in development to allow hot reloading
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
