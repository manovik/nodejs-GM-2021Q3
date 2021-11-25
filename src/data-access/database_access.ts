import { Sequelize } from 'sequelize';

import { DBGroupModel, DBUserModel, Group, User } from '@app/models';
import { sequelizeConfig as config } from './config';

const sequelize = new Sequelize(
  config.dbName,
  config.dbUser,
  config.dbPass,
  config.dbOpts
);

User.init(DBUserModel, {
  sequelize,
  modelName: 'user',
  timestamps: false,
  createdAt: false,
  paranoid: false
});

Group.init(DBGroupModel, {
  sequelize,
  modelName: 'group',
  timestamps: false,
  createdAt: false,
  paranoid: false
});

// sequelize.sync({ alter: true });

export { sequelize, User, Group };
