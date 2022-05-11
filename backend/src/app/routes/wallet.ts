import WalletModel from '../models/wallet';
import { Wallet } from '../models/wallet';
import 'dotenv/config';
import * as express from 'express';
import { Mutex } from 'async-mutex';

const secret_token = process.env.TOKEN_SECRET;
const router = express.Router();
const mutex = new Mutex();

router.get('/all', async (req, res) => {
  const wallets: Wallet[] = await WalletModel.find({});
  return res.status(200).json(Array.from(Object.values(wallets)));
});

router.post('/', (req, res) => {
  const wallet = new WalletModel(req.body.wallet);
  mutex.acquire().then((release) => {
    wallet
      .save()
      .then(() => {
        release();
        return res
          .status(201)
          .json({ message: 'Dinheiro adicionado com sucesso na carteira!' });
      })
      .catch((err: any) => {
        release();
        return res.status(500).json({
          message: 'Erro ao adicionar dinheiro na carteira!',
          error: err,
        });
      });
  });
});

export default router;
