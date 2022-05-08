import UserModel from '../models/user';
import bcrypt from 'bcryptjs';
import { User } from '../models/user';
import { Mutex } from 'async-mutex';
import * as express from 'express';

const router = express.Router();
const mutex = new Mutex();

router.get('/allUsers', async (req, res) => {
  const users: User[] = await UserModel.find({});
  return res.status(200).json(Array.from(Object.values(users)));
});

router.post('/getUserByCPF', async (req, res) => {
  const user: User = await UserModel.findOne({ cpf: req.body.cpf });
  if (user) return res.status(200).json(user);
  return res.status(500).json({
    message: 'Usuário não encontrado',
  });
});

router.post('/createUser', async (req, res) => {
  const selectedUser = await UserModel.findOne({ mail: req.body.user.mail });
  if (selectedUser) return res.status(400).send('Email already exists');
  const user = new UserModel({
    cpf: req.body.user.cpf,
    name: req.body.user.name,
    mail: req.body.user.mail,
    password: bcrypt.hashSync(req.body.user.password),
    isAdmin: req.body.user.isAdmin,
  });
  mutex.acquire().then((release) => {
    user
      .save()
      .then((savedUser: any) => {
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

router.post('/updateUser', async (req, res) => {
  const oldUser = await UserModel.findOne({ id: req.body.user._id });
  const user = new User();
  user.cpf = req.body.user.cpf;
  user.name = req.body.user.name;
  user.mail = req.body.user.mail;
  const comparePassword = bcrypt.compareSync(
    req.body.user.password,
    oldUser.password
  );
  user.password = comparePassword
    ? oldUser.password
    : bcrypt.hashSync(req.body.user.password);
  user.isAdmin = req.body.user.isAdmin;

  UserModel.findByIdAndUpdate(req.body.user._id, user, (err) => {
    if (err)
      return res.status(500).json({
        message: 'Erro ao atualizar usuário!',
        error: err,
      });
    return res.status(200).json({
      message: 'Usuário Atualizado!',
    });
  });
});

router.post('/deleteUser', (req, res) => {
  UserModel.findByIdAndDelete(req.body.user._id, req.body.user, (err) => {
    if (err)
      return res.status(500).json({
        message: 'Erro ao deletar usuário!',
        error: err,
      });
    return res.status(200).json({
      message: 'Usuário Deletado!',
    });
  });
});

export default router;
