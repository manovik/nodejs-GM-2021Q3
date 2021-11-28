import { Request, Response } from 'express';
import { Transaction } from 'sequelize/types';

import { RESPONSE_STATUS } from '@app/constants';
import { IUserGroupRequest } from '@app/types';
import { makeShortId } from '@app/utils';
import { userGroupService } from '@app/services';
import { sequelize } from '@app/data-access';

const { addUsersToGroup: addNewUsersToGroup } = userGroupService;

export const addUsersToGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  let transaction: Promise<Transaction>;
  const { userIds, groupId }: IUserGroupRequest = req.body;

  try {
    transaction = sequelize.transaction();

    for (const userId of userIds) {
      await addNewUsersToGroup(groupId, userId);
    }
    (await transaction).commit();
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
