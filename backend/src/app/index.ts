import express from 'express';
import cors from 'cors';
import connectToMongoDB from './database';

import usersRoutes from './routes/user';
import scheduleRoutes from './routes/schedule';
import loginRoutes from './routes/login';
import auth from './routes/auth';

const app = express();

connectToMongoDB();

app.use(cors());
app.use(express.json());
app.use('/api/users', usersRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/schedules', auth, scheduleRoutes);

export default app;
