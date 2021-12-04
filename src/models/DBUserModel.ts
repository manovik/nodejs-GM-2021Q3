import { DataTypes, Model } from 'sequelize';
import { v4 } from 'uuid';

import { IUser } from '@app/types';

export const DBUserModel = {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    autoIncrement: false,
    primaryKey: true,
    defaultValue: v4()
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    validate: {
      min: 4,
      max: 130
    }
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
};

export class User extends Model<IUser> implements IUser {
  readonly id!: string;

  public login!: string;

  public password!: string;

  public age!: number;

  readonly isDeleted!: boolean;
}
