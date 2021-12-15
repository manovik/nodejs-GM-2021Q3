import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getRequestContext, infoLogger } from '../logger';
import { IRequestInfo } from '../types';
import { CustomError } from '../errors';
import { RESPONSE_STATUS } from '../constants';

dotenv.config();

const secret = process.env.SECRET;

export const checkToken = async (authorization: string | undefined) => {
  const { requestId, data } = <IRequestInfo>getRequestContext();

  if (secret === undefined) {
    infoLogger.error({
      requestId,
      method: data.method,
      name: 'checkToken',
      authorization
    });
    throw new Error('Failed to decode token');
  }

  if (authorization) {
    const token = authorization.split('Bearer ')[1];

    if (token) {
      try {
        return jwt.verify(token, secret);
      } catch (err) {
        throw new CustomError('Forbidden', RESPONSE_STATUS.FORBIDDEN);
      }
    }
    throw new CustomError('Invalid token', RESPONSE_STATUS.BAD_REQUEST);
  }
  throw new CustomError('Unauthorized', RESPONSE_STATUS.UNAUTHORIZED);
};
