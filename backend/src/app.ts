import express from 'express';
import cors from 'cors';
import usersRoutes from './app/routes/user';
import scheduleRoutes from './app/routes/schedule';
import loginRoutes from './app/routes/login';
import walletRoutes from './app/routes/wallet';
import auth from './app/routes/auth';
import { mongoose } from '@typegoose/typegoose';

class MealPlannerAPI {
  public app;
  mongoURI = process.env.MONGO_URI;

  constructor() {
    this.app = express();
    if (this.mongoURI) {
      mongoose
        .connect(this.mongoURI, {
          autoIndex: false,
          maxPoolSize: 250,
          serverSelectionTimeoutMS: 15000,
          connectTimeoutMS: 15000,
        })
        .then(() => console.log('Connected to MongoDB'));
    } else {
      console.log('Failed to connect to MongoDB');
    }
    mongoose.set('returnOriginal', false);

    this.app.use(cors());
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: false, limit: '50mb' }));
    this.app.use('/api/users', usersRoutes);
    this.app.use('/api/login', loginRoutes);
    this.app.use('/api/schedules', scheduleRoutes);
    this.app.use('/api/wallets', walletRoutes);
  }
}

export default { express: new MealPlannerAPI().app, db: mongoose.connection };
