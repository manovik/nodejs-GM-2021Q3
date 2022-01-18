import { sequelize } from '@app/data-access';
import { CustomError } from '@app/errors';
import { UserGroup } from '@app/data-access';
import { IRequestInfo, IUserGroup } from '@app/types';
import { getRequestContext } from '@app/logger/context';
import { infoLogger } from '@app/logger';
import { RESPONSE_STATUS } from '@app/constants';

export const addUsersToGroup = async (array: IUserGroup[]) => {
  const { requestId, data } = <IRequestInfo>getRequestContext();

  infoLogger.info({ requestId, name: 'updateGroup', array, data });

  try {
    await sequelize.transaction((transaction) =>
      UserGroup.bulkCreate(array, { transaction })
    );
  } catch (err) {
    const { requestId, data } = <IRequestInfo>getRequestContext();

    infoLogger.error({
      requestId,
      method: data.method,
      name: 'updateGroup',
      array
    });
    throw new CustomError(
      `${ err }. Failed to associate users with groups.`,
      RESPONSE_STATUS.BAD_REQUEST
    );
  }
};
