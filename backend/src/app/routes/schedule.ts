import ScheduleModel from '../models/schedule';
import { Schedule } from '../models/schedule';
import { cloneDeep } from 'lodash';
import { Mutex } from 'async-mutex';
import * as express from 'express';

const router = express.Router();
let requested = false;

const mutex = new Mutex();
const schedulesMap: Record<string, Schedule> = {};

router.get('/all', async (req, res) => {
  if (!requested) {
    const schedules: Schedule[] = await ScheduleModel.find({});
    schedules.map(
      (schedule) => (schedulesMap[schedule._id] = cloneDeep(schedule))
    );
    requested = true;
  }
  return res.status(200).json(Array.from(Object.values(schedulesMap)));
});

router.post('/createSchedule', (req, res) => {
  const schedule = new ScheduleModel(req.body.schedule);
  mutex.acquire().then((release) => {
    schedule
      .save()
      .then((savedSchedule: any) => {
        if (requested)
          schedulesMap[savedSchedule._id] = cloneDeep(savedSchedule.toJSON());
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

export default router;
