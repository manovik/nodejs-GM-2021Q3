import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Validator } from './validate';
import { userRouter, groupRouter } from './routers';

dotenv.config();

const app = express();
const PORT = Number(process.env?.PORT) || 3005;

const validator = new Validator();

app.use(cors());
app.use(express.json());
app.use(validator.validate());
app.use('/users', userRouter);
app.use('/groups', groupRouter);

try {
  app.listen(PORT);
  console.log('App is on ', PORT);
} catch (err) {
  console.log('App is not started...\n', err);
}
