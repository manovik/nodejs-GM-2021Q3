import { RESPONSE_STATUS } from '@app/constants';
import { Group } from '@app/data-access';
import { CustomError } from '@app/errors';
import { infoLogger } from '@app/logger';
import { getRequestContext } from '@app/logger/context';
import { IGroup, IRequestInfo } from '@app/types';
import { makeShortId } from '@app/utils';

export const updateGroup = async (
  id: string,
  update: Partial<Omit<IGroup, 'id'>>
) => {
  const { requestId, data } = <IRequestInfo>getRequestContext();

  infoLogger.info({ requestId, name: 'updateGroup', id, update, data });
  try {
    const result = await Group.update(update, {
      where: { id }
    });

    return result;
  } catch (err) {
    const { requestId, data } = <IRequestInfo>getRequestContext();

    infoLogger.error({
      requestId,
      method: data.method,
      name: 'updateGroup',
      id,
      update
    });

    throw new CustomError(
      `${ err }. Could not update group with id ${ makeShortId(id) }.`,
      RESPONSE_STATUS.BAD_REQUEST
    );
  }
};

export const findGroup = async (id: string): Promise<IGroup | null> => {
  const { requestId, data } = <IRequestInfo>getRequestContext();

  infoLogger.info({ requestId, name: 'findGroup', id, data });

  try {
    const group: IGroup | null = await Group.findOne({
      where: { id }
    });

    return group;
  } catch (err) {
    const { requestId, data } = <IRequestInfo>getRequestContext();

    infoLogger.error({
      requestId,
      method: data.method,
      name: 'findGroup',
      id
    });
    throw new CustomError(
      `${ err }. Could not get group`,
      RESPONSE_STATUS.SERVER_ERR
    );
  }
};

export const fetchGroups = async () => {
  const { requestId, data } = <IRequestInfo>getRequestContext();

  infoLogger.info({
    requestId,
    name: 'fetchGroups',
    data
  });
  try {
    const groups: IGroup[] = await Group.findAll();

    return groups;
  } catch (err) {
    const { requestId, data } = <IRequestInfo>getRequestContext();

    infoLogger.error({
      requestId,
      method: data.method,
      name: 'fetchGroups'
    });

    throw new CustomError(
      `${ err }. Could not get groups.`,
      RESPONSE_STATUS.SERVER_ERR
    );
  }
};

export const createGroup = async (groupData: IGroup) => {
  const { requestId, data } = <IRequestInfo>getRequestContext();

  infoLogger.info({
    requestId,
    name: 'createGroup',
    groupData,
    data
  });
  try {
    const result = await Group.create(groupData);

    return result;
  } catch (err) {
    const { requestId, data } = <IRequestInfo>getRequestContext();

    infoLogger.error({
      requestId,
      name: 'createGroup',
      groupData,
      method: data.method
    });

    throw new CustomError(
      `${ err }. Could not create group.`,
      RESPONSE_STATUS.BAD_REQUEST
    );
  }
};

export const deleteGroup = async (id: string) => {
  const { requestId, data } = <IRequestInfo>getRequestContext();

  infoLogger.info({ requestId, name: 'deleteGroup', id, data });

  try {
    return await Group.destroy({
      where: { id }
    });
  } catch (err) {
    throw new CustomError(
      `${ err }. Could not delete group.`,
      RESPONSE_STATUS.SERVER_ERR
    );
  }
};
