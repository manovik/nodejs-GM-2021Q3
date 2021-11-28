import { Group } from '@app/data-access';
import { CustomError } from '@app/errors';
import { IGroup } from '@app/types';
import { makeShortId } from '@app/utils';

export const updateGroup = async (
  id: string,
  update: Partial<Omit<IGroup, 'id'>>
) => {
  const result = await Group.update(update, {
    where: { id }
  });

  return result;
};

export const findGroup = async (id: string): Promise<IGroup | null> => {
  try {
    const group: IGroup | null = await Group.findOne({
      where: { id }
    });

    return group;
  } catch (err) {
    throw new CustomError(
      `${ err }. Could not find group with id ${ makeShortId(id) }.`
    );
  }
};

export const fetchGroups = async () => {
  try {
    const groups: IGroup[] = await Group.findAll();

    return groups;
  } catch (err) {
    throw new CustomError(`${ err }. Could not get groups.`);
  }
};

export const createGroup = async (groupData: IGroup) => {
  try {
    const result = await Group.create(groupData);

    return result;
  } catch (err) {
    throw new CustomError(`${ err }. Could not create group.`);
  }
};

export const deleteGroup = async (id: string) => {
  try {
    return await Group.destroy({
      where: { id }
    });
  } catch (err) {
    throw new CustomError(`${ err }. Could not create group.`);
  }
};
