import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { Validator } from './validate';
import { userRouter, groupRouter } from './routers';
import { userGroupRouter } from './routers/userGroupRouter';
import { infoLogger, useLogger } from './logger';
import { getRequestContext } from './logger/context';
import { IRequestInfo } from './types';
import { CustomError } from './errors';
import { errorHandler } from './errors/err';

dotenv.config();

const app = express();
const PORT = Number(process.env?.PORT) || 3005;

const validator = new Validator();

app
  .use(cors())
  .use(express.json())
  .use(useLogger)
  .use(validator.validate)
  .use('/users', userRouter)
  .use('/groups', groupRouter)
  .use('/associate', userGroupRouter)
  .use(errorHandler);

try {
  app.listen(PORT);
  console.log('App is on ', PORT);
} catch (err) {
  console.log('App is not started...\n', err);
}

process
  .on('uncaughtException', (err) => {
    infoLogger.error(err);
    process.exit(1);
  })
  .on('unhandledRejection', (err) => {
    infoLogger.error(err);
  });
