import jwt from 'jsonwebtoken';
import UserModel from '../models/user';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import * as express from 'express';

const secret_token = process.env.TOKEN_SECRET;
const router = express.Router();

router.post('/', async (req, res) => {
  const selectedUser = await UserModel.findOne({ mail: req.body.user.mail });
  if (!selectedUser) return res.status(401).json('Email or Password incorrect');

  const passwordAndUserMatch = bcrypt.compareSync(
    req.body.user.password,
    selectedUser.password
  );
  if (!passwordAndUserMatch)
    return res.status(401).json('Email or Password incorrect');
  const token = jwt.sign(
    { mail: selectedUser.mail, admin: selectedUser.isAdmin },
    secret_token!
  );
  res.header('authorization-token', token);
  res.status(201).json(token);
});

router.post('/parseTokenToMail', (req, res) => {
  const tokenConverted = jwt.verify(req.body.token, secret_token!);
  res.status(201).json(Array.from(Object.values(tokenConverted))[0]);
});

export default router;
