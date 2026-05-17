const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer;

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri && process.env.NODE_ENV !== 'production') {
      memoryServer = await MongoMemoryServer.create();
      uri = memoryServer.getUri();
      console.log('Using in-memory MongoDB for development:', uri);
    }
    if (!uri) {
      throw new Error('MongoDB URI is not configured. Set MONGODB_URI or MONGO_URI in .env');
    }

    console.log(
      'Connecting to MongoDB:',
      uri.startsWith('mongodb+srv://') ? uri.replace(/(mongodb\+srv:\/\/)([^:]+):([^@]+)@/, '$1***:***@') : uri
    );
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
