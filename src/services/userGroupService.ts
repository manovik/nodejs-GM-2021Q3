import { CustomError } from '@app/errors';
import { UserGroup } from '@app/data-access';
import { makeShortId } from '@app/utils';

export const addUsersToGroup = async (groupId: string, userId: string) => {
  try {
    return await UserGroup.create({ userId, groupId });
  } catch (err) {
    throw new CustomError(
      `${ err }. Could not associate user ${ makeShortId(
        userId
      ) } to group ${ makeShortId(groupId) }.`
    );
  }
};
