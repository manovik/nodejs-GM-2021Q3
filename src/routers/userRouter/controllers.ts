import { NextFunction, Request, Response } from 'express';

import { RESPONSE_STATUS } from '@app/constants';
import { userService } from '@app/services';
import { CustomError } from '@app/errors';
import { makeShortId } from '@app/utils';
import { IUser, IUserOutput } from '@app/types';
import { mapUserOutput } from '@app/utils';
import { v4 } from 'uuid';

const {
  findUser,
  findAllNotDeletedUsers,
  updateUser: updateInDB,
  createUser: createNewUser
} = userService;

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { loginSubstring, limit = 10 } = req.query;

    const users = await findAllNotDeletedUsers(
      parseInt(<string>limit),
      <string>loginSubstring
    );

    const mappedUsers: IUserOutput[] | undefined = mapUserOutput(users);

    res.status(RESPONSE_STATUS.OK).json(mappedUsers);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    next(err);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await findUser(id);

    if (user) {
      res.status(RESPONSE_STATUS.OK).json(user);
      return;
    }
    res.status(RESPONSE_STATUS.NOT_FOUND).json({});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    next(err);
  }
};

export const deleteUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {
    const [result] = await updateInDB(id, { isDeleted: true });

    if (result) {
      res
        .status(RESPONSE_STATUS.DELETED)
        .json(`User with id ${ makeShortId(id) } was successfully deleted.`);
    } else {
      throw new CustomError(`Could not find user with id "${ makeShortId(id) }"`);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    next(err);
  }
};

export const updateUser = async (
  req: Request<{ id: string }, null, IUser>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {
    const [result] = await updateInDB(id, { ...req.body });

    if (result) {
      res
        .status(RESPONSE_STATUS.UPDATED)
        .json(`User with id ${ makeShortId(id) } was successfully updated.`);
    } else {
      throw new CustomError(`Could not find user with id "${ makeShortId(id) }"`);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    next(err);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user: IUser = req.body;

    const result = await createNewUser({ ...user, id: v4() });

    res
      .status(RESPONSE_STATUS.CREATED)
      .json(
        `User ${ result.login } successfully created with id ${ makeShortId(
          result.id
        ) }`
      );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    next(err);
  }
};
