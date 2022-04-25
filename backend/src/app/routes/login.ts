import jwt from 'jsonwebtoken';
import UserModel from '../models/user';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import { Router } from 'express';

const secret_token = process.env.TOKEN_SECRET;
const router = Router();

router.post('/', async (req, res) => {
  const selectedUser = await UserModel.findOne({ mail: req.body.user.mail });
  if (!selectedUser) return res.status(400).send('Email or Password incorrect');

  const passwordAndUserMatch = bcrypt.compareSync(
    req.body.user.password,
    selectedUser.password
  );
  if (!passwordAndUserMatch)
    return res.status(400).send('Email or Password incorrect');
  const token = jwt.sign(
    { _id: selectedUser._id, admin: selectedUser.admin },
    secret_token!
  );
  res.header('authorization-token', token);
  const { _id } = selectedUser;
  const userWithToken = {
    user: _id,
    token: token,
  };
  res.status(201).json(token);
});

export default router;
