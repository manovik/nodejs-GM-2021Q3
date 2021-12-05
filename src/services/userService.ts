import { Sequelize } from 'sequelize';

import { User } from '@app/data-access';
import { CustomError } from '@app/errors';
import { IRequestInfo, IUser } from '@app/types';
import { infoLogger } from '@app/logger';
import { getRequestContext } from '@app/logger/context';
import { RESPONSE_STATUS } from '@app/constants';

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

export const findUser = async (id: string): Promise<IUser | null> => {
  const { requestId, data } = <IRequestInfo>getRequestContext();

  infoLogger.info({ requestId, name: 'findUser', id, data });

  try {
    const user: IUser | null = await User.findOne({
      where: {
        id,
        isDeleted: false
      }
    });

    return user;
  } catch (err) {
    const { requestId, data } = <IRequestInfo>getRequestContext();

    infoLogger.error({ requestId, method: data.method, name: 'findUser', id });
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
