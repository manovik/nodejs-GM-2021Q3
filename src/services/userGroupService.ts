import { sequelize } from '@app/data-access';

import { CustomError } from '@app/errors';
import { UserGroup } from '@app/data-access';
import { IUserGroup } from '@app/types';

export const addUsersToGroup = async (array: IUserGroup[]) => {
  try {
    await sequelize.transaction((transaction) =>
      UserGroup.bulkCreate(array, { transaction })
    );
  } catch (err) {
    throw new CustomError(`${ err }. Failed to associate users with groups.`);
  }
};
