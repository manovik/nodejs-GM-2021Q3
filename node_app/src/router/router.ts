import { Router } from 'express';
import { User } from '../types';
import { RESPONSE_STATUS } from '../constants';
import {
  findUser,
  findUserIndex,
  getAllNotDeletedUsers as getUsers,
  getAutoSuggestUsers,
  users
} from '../users';
import { CustomError } from '../errors';
import { makeShortId } from '../utils';

const router = Router();

router.get('/', (req, res): void => {
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
});

router.get('/:id', (req, res): void => {
  const { id } = req.params;

  try {
    const user = findUser(id);

    res.status(RESPONSE_STATUS.OK).json(user);
  } catch (err: any) {
    res
      .status(RESPONSE_STATUS.BAD_REQUEST)
      .json(`Could not get user with id "${ makeShortId(id) }".`);
    throw new CustomError(`${ err?.message }`);
  }
});

router.delete('/:id', (req, res): void => {
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
  } catch (err: unknown) {
    res.status(RESPONSE_STATUS.BAD_REQUEST).json(`User was not deleted.`);
    throw new CustomError(
      `Could not find user with id "${ makeShortId(id) }".\n${ err }`
    );
  }
});

router.put('/', (req, res): void => {
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
});

router.post('/', async (req, res) => {
  try {
    const user: User = req.body;
    const { id }: User = req.body;

    if (findUserIndex(id) < 0) {
      users.push(user);
      res.sendStatus(RESPONSE_STATUS.CREATED);
    } else {
      throw new CustomError(
        `Could not create. User with id "${ makeShortId(id) }" already exists`
      );
    }
  } catch (err: any) {
    res.status(RESPONSE_STATUS.BAD_REQUEST).json(err?.message);
  }
});

export default router;
