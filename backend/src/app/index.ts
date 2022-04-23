import express from 'express';
import cors from 'cors';
import connectToMongoDB from './database';

import usersRoutes from './routes/user';

const app = express();

connectToMongoDB();

app.use(cors());
app.use(express.json());
app.use('/api/users', usersRoutes);

export default app;
