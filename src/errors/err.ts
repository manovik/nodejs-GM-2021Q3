import { Request, Response, NextFunction } from 'express';

import { getRequestContext, infoLogger } from '@app/logger';
import { IRequestInfo } from '@app/types';
import { CustomError } from '.';

export const errorHandler = async (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { requestId } = <IRequestInfo>getRequestContext();

  infoLogger.error({ requestId, err: error });
  const status = error instanceof CustomError ? error.statusCode : 500;

  res.status(status).send(error.message);
};
