import { Sequelize } from 'sequelize';

import { User } from '@app/data-access';
import { CustomError } from '@app/errors';
import { IUser } from '@app/types';

export const updateUser = async (
  id: string,
  update: Partial<Omit<IUser, 'id'>>
) => {
  const result = await User.update(update, {
    where: {
      id,
      isDeleted: false
    }
  });

  return result;
};

export const findUser = async (id: string): Promise<IUser | null> => {
  try {
    const user: IUser | null = await User.findOne({
      where: {
        id,
        isDeleted: false
      }
    });

    return user;
  } catch (err) {
    throw new CustomError(`${ err }. Could not get user.`);
  }
};

export const findAllNotDeletedUsers = async (
  limit = 10,
  searchString = ''
): Promise<IUser[]> => {
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
      limit
    });

    return users;
  } catch (err) {
    throw new CustomError(`${ err }. Could not get users.`);
  }
};

export const createUser = async (userData: IUser) => {
  try {
    return await User.create(userData);
  } catch (err) {
    throw new CustomError(`${ err }. Could not create user.`);
  }
};
