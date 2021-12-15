import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import { IUser } from '@app/types';

dotenv.config();
const secret = process.env.SECRET;

export const getToken = async (user: IUser): Promise<string> => {
  const { login, id } = user;

  if (secret) return jwt.sign({ login, id }, secret, { expiresIn: 3600 });
  throw new Error('Secret is missed');
};
