import UserModel from '../models/user';
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

router.post('/createUser', (req, res) => {
  const user = new UserModel(req.body.user);
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
