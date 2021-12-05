import { IContextData, IRequestInfo } from '@app/types';
import { Request, Response, NextFunction } from 'express';
import { v4 } from 'uuid';
import { createLogger, format, transports } from 'winston';
import { createRequestContext, getRequestContext } from './context';

export const infoLogger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [new transports.Console()]
});

export const useLogger = (
  req: Request<
    { id: string },
    null,
    null,
    { limit: string; loginSubstring: string }
  >,
  _res: Response,
  next: NextFunction
) => {
  const { method, body, query, params, headers, url } = req;

  const corId = <string>headers.cor_id || v4().substring(0, 8);

  const data: IContextData = {
    method,
    host: headers.host,
    url,
    body,
    query: query || {},
    params: params || {},
    corId
  };

  createRequestContext(corId, data);

  infoLogger.info(getRequestContext());
  next();
};

type middlewareFunc = (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const withLogger = (service: string) => (controller: middlewareFunc) => {
  return async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const { requestId, data } = <IRequestInfo>getRequestContext();

    infoLogger.info({ requestId, data, meta: { service } });

    return controller(req, res, next);
  };
};
