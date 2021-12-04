import { DataTypes } from 'sequelize';
import { Model } from 'sequelize';

import { IUserGroup } from '@app/types';

export const DBUserGroupModel = {
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  groupId: {
    type: DataTypes.STRING,
    allowNull: false
  }
};

export class UserGroup extends Model<IUserGroup> implements IUserGroup {
  public userId!: string;

  public groupId!: string;
}
