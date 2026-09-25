import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/worknear';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`\n[MongoDB Connection Warning]: Could not connect to ${uri}`);
    console.error(`Error message: ${error.message}`);
    console.warn(`Tip: If you're using MongoDB Atlas, update MONGODB_URI in server/.env with your cluster connection string.\n`);
    // Do not terminate process in development so server can still serve health check
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};
