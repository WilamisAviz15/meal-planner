import RefundModel, { Refund } from '../models/refund';
import 'dotenv/config';
import * as express from 'express';
import { Mutex } from 'async-mutex';

const secret_token = process.env.TOKEN_SECRET;
const router = express.Router();
const mutex = new Mutex();

router.get('/all', async (req, res) => {
  const refunds: Refund[] = await RefundModel.find({});
  return res.status(200).json(Array.from(Object.values(refunds)));
});

router.post('/', (req, res) => {
  const refund = new RefundModel(req.body.refund);
  mutex.acquire().then((release) => {
    refund
      .save()
      .then(() => {
        release();
        return res
          .status(201)
          .json({ message: 'Solicitação de reembolso realizada!' });
      })
      .catch((err: any) => {
        release();
        return res.status(500).json({
          message: 'Erro ao fazer a solicitação de reembolso!',
          error: err,
        });
      });
  });
});

export default router;
