import { Sequelize, Model } from 'sequelize';

import { DBUserModel } from '@app/models/';
import { sequelizeConfig as config } from './config';
import { IUser } from '@app/types';

const sequelize = new Sequelize(
  config.dbName,
  config.dbUser,
  config.dbPass,
  config.dbOpts
);

class User extends Model<IUser> implements IUser {
  readonly id!: string;

  public login!: string;

  public password!: string;

  public age!: number;

  readonly isDeleted!: boolean;
}

User.init(DBUserModel, {
  sequelize,
  modelName: 'user',
  timestamps: false,
  createdAt: false,
  paranoid: false
});

// sequelize.sync({ alter: true });

export { sequelize, User };
