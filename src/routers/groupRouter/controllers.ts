import { NextFunction, Request, Response } from 'express';
import { v4 } from 'uuid';

import { RESPONSE_STATUS } from '@app/constants';
import { groupService } from '@app/services';
import { IGroup } from '@app/types';
import { makeShortId } from '@app/utils';

const {
  fetchGroups,
  findGroup,
  updateGroup: updateInDB,
  createGroup,
  deleteGroup
} = groupService;

export const getAllGroups = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const groups = await fetchGroups();

    res.status(RESPONSE_STATUS.OK).json(groups);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    next(err);
  }
};

export const getGroupById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {
    const group = await findGroup(id);

    if (group) {
      res.status(RESPONSE_STATUS.OK).json(group);
      return;
    }
    res.status(RESPONSE_STATUS.NOT_FOUND).json({});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    next(err);
  }
};

export const deleteGroupById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await deleteGroup(id);

    if (result) {
      res
        .status(RESPONSE_STATUS.DELETED)
        .json(`Group with id ${ makeShortId(id) } was successfully deleted.`);
    } else {
      res
        .status(RESPONSE_STATUS.NOT_FOUND)
        .json(`Group with id ${ makeShortId(id) } was not found.`);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    next(err);
  }
};

export const updateGroup = async (
  req: Request<{ id: string }, null, IGroup>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {
    const [result] = await updateInDB(id, req.body);

    if (result) {
      res
        .status(RESPONSE_STATUS.UPDATED)
        .json(`Group with id ${ makeShortId(id) } was successfully updated.`);
    } else {
      res
        .status(RESPONSE_STATUS.BAD_REQUEST)
        .json(`Group with id ${ makeShortId(id) } was not updated.`);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    next(err);
  }
};

export const createNewGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const group: IGroup = req.body;

    const result = await createGroup({ ...group, id: v4() });

    res
      .status(RESPONSE_STATUS.CREATED)
      .json(
        `Group ${ result.name } successfully created with id ${ makeShortId(
          result.id
        ) }`
      );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    next(err);
  }
};
