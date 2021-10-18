import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Validator } from './validate';
import { router } from './router';

dotenv.config();

const app = express();
const { PORT } = process.env;

const validator = new Validator();

app.use(cors());
app.use(express.json());
app.use(validator.validate());
app.use('/', router);

app.listen(PORT);
