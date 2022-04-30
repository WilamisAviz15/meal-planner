import ScheduleModel from '../models/schedule';
import { Schedule } from '../models/schedule';
import { cloneDeep } from 'lodash';
import { Mutex } from 'async-mutex';
import * as express from 'express';

const router = express.Router();
const mutex = new Mutex();

router.get('/all', async (req, res) => {
  const schedules: Schedule[] = await ScheduleModel.find({});
  return res.status(200).json(Array.from(Object.values(schedules)));
});

router.post('/createSchedule', (req, res) => {
  const schedule = new ScheduleModel(req.body.schedule);
  mutex.acquire().then((release) => {
    schedule
      .save()
      .then(() => {
        release();
        return res
          .status(201)
          .json({ message: 'Agendamento cadastrado com sucesso!' });
      })
      .catch((err: any) => {
        release();
        return res.status(500).json({
          message: 'Erro ao cadastrar agendamento!',
          error: err,
        });
      });
  });
});

router.post('/updateSchedule', (req, res) => {
  ScheduleModel.findByIdAndUpdate(
    req.body.schedule._id,
    req.body.schedule,
    (err) => {
      if (err)
        return res.status(500).json({
          message: 'Erro ao atualizar agendamento!',
          error: err,
        });
      return res.status(200).json({
        message: 'Agendamento Atualizado!',
      });
    }
  );
});

router.post('/one', (req, res) => {
  ScheduleModel.findByIdAndDelete(
    req.body.schedule._id,
    req.body.schedule,
    (err) => {
      if (err)
        return res.status(500).json({
          message: 'Erro ao deletar agendamento!',
          error: err,
        });
      return res.status(200).json({
        message: 'Agendamento Deletado!',
      });
    }
  );
});

router.delete('/all', (req, res) => {
  ScheduleModel.deleteMany((err) => {
    if (err)
      return res.status(500).json({
        message: 'Erro ao deletar agendamentos!',
        error: err,
      });
    return res.status(200).json({
      message: 'Todos os agendamentos foram deletados!',
    });
  });
});

export default router;
