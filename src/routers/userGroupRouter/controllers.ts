import { Request, Response } from 'express';

import { RESPONSE_STATUS } from '@app/constants';
import { IUserGroup, IUserGroupRequest } from '@app/types';
import { makeShortId } from '@app/utils';
import { userGroupService } from '@app/services';

const { addUsersToGroup: addNewUsersToGroup } = userGroupService;

export const addUsersToGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userIds, groupId }: IUserGroupRequest = req.body;
  const usersWithGroups: IUserGroup[] = userIds.map((userId) => ({
    userId,
    groupId
  }));

  try {
    await addNewUsersToGroup(usersWithGroups);
    res
      .status(RESPONSE_STATUS.CREATED)
      .send(
        `Users successfully associated with group id ${ makeShortId(groupId) }`
      );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    res.status(RESPONSE_STATUS.BAD_REQUEST).send(err?.message);
  }
};
