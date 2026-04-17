import mongoose from 'mongoose';

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/quiz-app';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected successfully');
}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err.message);
  process.exit(1);
});

export default mongoose;