import { Request, Response } from 'express';

import { RESPONSE_STATUS } from '@app/constants';
import { groupService } from '@app/services';
import { CustomError } from '@app/errors';
import { IGroup } from '@app/types';
import { v4 } from 'uuid';
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
  res: Response
): Promise<void> => {
  try {
    const groups = await fetchGroups();

    res.status(RESPONSE_STATUS.OK).json(groups);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    res
      .status(RESPONSE_STATUS.BAD_REQUEST)
      .json(`Could not get list of groups.`);
    throw new CustomError(err as string);
  }
};

export const getGroupById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const group = await findGroup(id);

    res.status(RESPONSE_STATUS.OK).json(group);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    res.status(RESPONSE_STATUS.BAD_REQUEST).json(`${ err?.message }`);
  }
};

export const deleteGroupById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await deleteGroup(id);

    if (result > 0) {
      res
        .status(RESPONSE_STATUS.DELETED)
        .json(`Group with id ${ makeShortId(id) } was successfully deleted.`);
    } else {
      throw new CustomError(
        `Could not find group with id "${ makeShortId(id) }"`
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    res.status(RESPONSE_STATUS.BAD_REQUEST).json(err?.message);
  }
};

export const updateGroup = async (
  req: Request<{ id: string }, null, IGroup>,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const [result] = await updateInDB(id, req.body);

    if (result > 0) {
      res
        .status(RESPONSE_STATUS.UPDATED)
        .json(`Group with id ${ makeShortId(id) } was successfully updated.`);
    } else {
      throw new CustomError(
        `Could not find group with id "${ makeShortId(id) }"`
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    res
      .status(RESPONSE_STATUS.BAD_REQUEST)
      .json(`Group was not updated. Error message: ${ err?.message }`);
  }
};

export const createNewGroup = async (
  req: Request,
  res: Response
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
    res.status(RESPONSE_STATUS.BAD_REQUEST).json(err?.message);
  }
};
