import express from 'express';
import cors from 'cors';

import { validator } from './validate';
import { userRouter, groupRouter } from './routers';
import { userGroupRouter } from './routers';
import { infoLogger, useLogger } from './logger';
import { errorHandler } from './errors/err';
import { useAuth } from './auth';

const app = express();
const PORT = Number(process.env?.PORT) || 3005;

app
  .use(cors())
  .use(express.json())
  .use(useLogger)
  .use(useAuth)
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
