import { Request, Response } from 'express';

import { v4 as createUUID } from 'uuid';

import { User } from '@app/types';
import { RESPONSE_STATUS } from '@app/constants';
import { userService } from '@app/services';
import { CustomError } from '@app/errors';
import { makeShortId } from '@app/utils';

const {
  findUser,
  isLoginExists,
  findUserIndex,
  getAllNotDeletedUsers: getUsers,
  getAutoSuggestUsers,
  users
} = userService;

export const getAllUsers = (req: Request, res: Response): void => {
  let users: User[];

  try {
    const { loginSubstring, limit } = req.query;

    if (loginSubstring || limit) {
      users = getAutoSuggestUsers(<string>loginSubstring, +(<string>limit));
    } else {
      users = getUsers();
    }

    res.status(RESPONSE_STATUS.OK).json(users);
  } catch (err: any) {
    res
      .status(RESPONSE_STATUS.BAD_REQUEST)
      .json(`Could not get list of users.`);
    throw new CustomError(err);
  }
};

export const getUserById = (req: Request, res: Response): void => {
  const { id } = req.params;

  try {
    const user = findUser(id);
    const userNotExist = user && !user.isDeleted ? false : true;

    if (userNotExist) {
      throw new CustomError(`Could not get user with id "${ makeShortId(id) }".`);
    }
    res.status(RESPONSE_STATUS.OK).json(user);
  } catch (err: any) {
    res.status(RESPONSE_STATUS.BAD_REQUEST).json(`${ err?.message }`);
  }
};

export const deleteUserById = (req: Request, res: Response): void => {
  const { id } = req.params;

  try {
    const idx: number = findUserIndex(id);

    if (idx >= 0) {
      users[idx].isDeleted = true;

      res
        .status(RESPONSE_STATUS.DELETED)
        .json(`User with id ${ makeShortId(id) } was successfully deleted.`);
    } else {
      throw new CustomError(`Could not find user with id "${ makeShortId(id) }"`);
    }
  } catch (err: any) {
    res.status(RESPONSE_STATUS.BAD_REQUEST).json(err?.message);
  }
};

export const updateUser = (req: Request, res: Response): void => {
  const { id } = <User>req.body;

  try {
    const idx: number = findUserIndex(id);

    if (idx >= 0) {
      const oldUserInfo = users[idx];

      users[idx] = { ...oldUserInfo, ...req.body };

      res
        .status(RESPONSE_STATUS.UPDATED)
        .json(`User with id ${ makeShortId(id) } was successfully updated.`);
    } else {
      throw new CustomError(`Could not find user with id "${ makeShortId(id) }"`);
    }
  } catch (err: any) {
    res
      .status(RESPONSE_STATUS.BAD_REQUEST)
      .json(`User was not updated. Error message: ${ err?.message }`);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user: User = req.body;
    const { login }: User = req.body;

    if (isLoginExists(login)) {
      throw new CustomError(
        `Could not create. User with login ${ login } already exists.`
      );
    }

    users.push({ ...user, id: createUUID(), isDeleted: false });

    res.sendStatus(RESPONSE_STATUS.CREATED);
  } catch (err: any) {
    res.status(RESPONSE_STATUS.BAD_REQUEST).json(err?.message);
  }
};
