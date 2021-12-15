import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

import { User } from '@app/data-access';
import { CustomError } from '@app/errors';
import { ICredentials, IRequestInfo, IUser } from '@app/types';
import { infoLogger } from '@app/logger';
import { getRequestContext } from '@app/logger/context';
import { RESPONSE_STATUS } from '@app/constants';
import { getToken, checkForCredentials } from '@app/auth';

dotenv.config();
const secret = process.env.SECRET;

export const updateUser = async (
  id: string,
  update: Partial<Omit<IUser, 'id'>>
) => {
  const { requestId, data } = <IRequestInfo>getRequestContext();

  infoLogger.info({ requestId, name: 'updateUser', id, update, data });
  try {
    const result = await User.update(update, {
      where: {
        id,
        isDeleted: false
      }
    });

    return result;
  } catch (err) {
    const { requestId, data } = <IRequestInfo>getRequestContext();

    infoLogger.error({
      requestId,
      method: data.method,
      name: 'updateUser',
      id,
      update
    });
    throw new CustomError(
      `${ err }. Could not update user.`,
      RESPONSE_STATUS.BAD_REQUEST
    );
  }
};

export const findUserById = async (id: string): Promise<IUser | null> => {
  const { requestId, data } = <IRequestInfo>getRequestContext();

  infoLogger.info({ requestId, name: 'findUserById', id, data });

  return findUserByProp('id', id);
};

export const findUserByProp = async (
  prop: 'login' | 'id' | 'age',
  value: string
): Promise<IUser | null> => {
  const { requestId, data } = <IRequestInfo>getRequestContext();

  infoLogger.info({ requestId, name: 'findUserByProp', prop, value, data });

  try {
    const user: IUser | null = await User.findOne({
      where: {
        [prop]: value,
        isDeleted: false
      }
    });

    return user;
  } catch (err) {
    const { requestId, data } = <IRequestInfo>getRequestContext();

    infoLogger.error({
      requestId,
      method: data.method,
      name: 'findUserByProp',
      prop,
      value
    });
    throw new CustomError(
      `${ err }. Could not get user.`,
      RESPONSE_STATUS.NOT_FOUND
    );
  }
};

export const findAllNotDeletedUsers = async (
  limit = 50,
  searchString = ''
): Promise<IUser[]> => {
  const { requestId, data } = <IRequestInfo>getRequestContext();

  infoLogger.info({
    requestId,
    name: 'findAllNotDeletedUsers',
    limit,
    searchString,
    data
  });

  try {
    const users: IUser[] = await User.findAll({
      where: {
        isDeleted: false,
        login: Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('login')),
          'LIKE',
          '%' + searchString + '%'
        )
      },
      limit,
      order: [[ 'login', 'ASC' ]]
    });

    return users;
  } catch (err) {
    const { requestId, data } = <IRequestInfo>getRequestContext();

    infoLogger.error({
      requestId,
      method: data.method,
      name: 'findAllNotDeletedUsers',
      limit,
      searchString
    });

    throw new CustomError(
      `${ err }. Could not get users.`,
      RESPONSE_STATUS.BAD_REQUEST
    );
  }
};

export const createUser = async (userData: IUser) => {
  const { requestId, data } = <IRequestInfo>getRequestContext();

  infoLogger.info({
    requestId,
    name: 'createUser',
    userData,
    data
  });

  try {
    return await User.create(userData);
  } catch (err) {
    const { requestId, data } = <IRequestInfo>getRequestContext();

    infoLogger.error({
      requestId,
      method: data.method,
      name: 'createUser',
      userData
    });
    throw new CustomError(
      `${ err }. Could not create user.`,
      RESPONSE_STATUS.BAD_REQUEST
    );
  }
};

export const logUserIn = async (credentials: ICredentials): Promise<string> => {
  const { requestId, data } = <IRequestInfo>getRequestContext();

  infoLogger.info({
    requestId,
    method: data.method,
    name: 'logUserIn',
    credentials
  });
  try {
    if (checkForCredentials(credentials) && secret) {
      const user: IUser | null = await findUserByProp(
        'login',
        credentials.login
      );

      if (user?.password === credentials.password) {
        const token = await getToken(user);

        return token;
      } else {
        throw 'Invalid login or password';
      }
    } else {
      throw 'Login or password is missed';
    }
  } catch (err) {
    infoLogger.error({
      requestId,
      method: data.method,
      name: 'logUserIn',
      credentials,
      err
    });
    throw new CustomError(
      `${ err }. Could not log in.`,
      RESPONSE_STATUS.SERVER_ERR
    );
  }
};
