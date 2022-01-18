import { NextFunction, Request, Response } from 'express';

import { findUserById } from '@app/services/userService';
import { getRequestContext, infoLogger } from '../logger';
import { loginEndpoint } from '../constants';
import { checkToken } from './checkToken';
import { IRequestInfo } from '../types';
import { JwtPayload } from 'jsonwebtoken';
import { CustomError } from '@app/errors';

const getUserIdFromToken = (token: JwtPayload) => {
  return token.id;
};

export const useAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { requestId, data } = <IRequestInfo>getRequestContext();

  if (req.url === loginEndpoint) {
    infoLogger.info({
      requestId,
      method: data.method,
      name: 'token checker',
      loginEndpoint
    });
    return next();
  }
  try {
    const { authorization } = req.headers;

    infoLogger.info({
      requestId,
      method: data.method,
      name: 'token checker',
      authorization
    });

    const tokenData = await checkToken(authorization);
    const id: string = getUserIdFromToken(<JwtPayload>tokenData);
    const user = await findUserById(id);

    if (user) next();
    else next(new CustomError('Invalid token', 401));
  } catch (err) {
    infoLogger.error({
      requestId,
      method: data.method,
      name: 'token checker',
      err
    });
    return next(err);
  }
};
