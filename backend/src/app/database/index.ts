import mongoose from 'mongoose';

const mongoURI = process.env.MONGO_URI;

export default function connectToMongoDB(): void {
  if (mongoURI) {
    mongoose.connect(
      mongoURI,
      {
        autoIndex: false,
        maxPoolSize: 250,
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 15000,
      },
      () => console.log('Connected to MongoDB')
    );
  } else {
    console.log('Failed to connect to MongoDB');
  }
}
