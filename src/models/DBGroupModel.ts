import { DataTypes } from 'sequelize';
import { v4 } from 'uuid';
import { Model } from 'sequelize';

import { IGroup, Permission } from '@app/types';

export const DBGroupModel = {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    autoIncrement: false,
    primaryKey: true,
    defaultValue: v4()
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  permissions: {
    type: DataTypes.ARRAY(
      DataTypes.ENUM('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES')
    ),
    allowNull: false,
    defaultValue: ['READ']
  }
};

export class Group extends Model<IGroup> implements IGroup {
  readonly id!: string;

  public name!: string;

  public permissions!: Permission[];
}
