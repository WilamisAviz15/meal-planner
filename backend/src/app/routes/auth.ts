const jwt = require('jsonwebtoken');
import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';

export default function (req: Request, res: Response, next: NextFunction) {
  const token = req.header('authorization-token');
  if (!token) return res.status(401).send('Access denied.');
  try {
    const userVerified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.body.user = userVerified;
    next();
  } catch (error) {
    return res.status(401).send('Access denied.');
  }
}
