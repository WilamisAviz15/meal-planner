import UserModel from '../models/user';
import bcrypt from 'bcryptjs';
import { User } from '../models/user';
import { cloneDeep } from 'lodash';
import { Mutex } from 'async-mutex';
import { Router } from 'express';

const router = Router();
let requested = false;

const mutex = new Mutex();
const usersMap: Record<string, User> = {};

router.get('/allUsers', async (req, res) => {
  if (!requested) {
    const users: User[] = await UserModel.find({});
    users.map((user) => (usersMap[user._id] = cloneDeep(user)));
    requested = true;
  }
  return res.status(200).json(Array.from(Object.values(usersMap)));
});

router.post('/createUser', async (req, res) => {
  const selectedUser = await UserModel.findOne({ mail: req.body.user.mail });
  if (selectedUser) return res.status(400).send('Email already exists');
  const user = new UserModel({
    name: req.body.user.name,
    mail: req.body.user.mail,
    password: bcrypt.hashSync(req.body.user.password),
    isAdmin: req.body.user.isAdmin,
  });
  mutex.acquire().then((release) => {
    user
      .save()
      .then((savedUser: any) => {
        if (requested) usersMap[savedUser._id] = cloneDeep(savedUser.toJSON());
        release();
        return res.status(201).json({
          message: 'Usuário cadastrado com sucesso!',
        });
      })
      .catch((err: any) => {
        release();
        return res.status(500).json({
          message: 'Erro ao cadastrar associado!',
          error: err,
        });
      });
  });
});

export default router;
