import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    console.log(`⚠️  Server will continue without database. Some features may not work.`);
    console.log(`💡 For full functionality, please set up MongoDB.`);
    return null;
  }
};

export default connectDB;
