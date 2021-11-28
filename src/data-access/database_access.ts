import { Sequelize } from 'sequelize';

import {
  DBGroupModel,
  DBUserModel,
  DBUserGroupModel,
  Group,
  User,
  UserGroup
} from '@app/models';

import { sequelizeConfig as config } from './config';
const sequelize = new Sequelize(
  config.dbName,
  config.dbUser,
  config.dbPass,
  config.dbOpts
);

try {
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

  UserGroup.init(DBUserGroupModel, {
    sequelize,
    modelName: 'user_group',
    timestamps: false,
    createdAt: false,
    paranoid: false
  });

  User.belongsToMany(Group, { through: UserGroup });

  Group.belongsToMany(User, { through: UserGroup });

  // sequelize.sync({ force: true });
} catch (err) {
  console.log(err);
}

export { sequelize, User, Group, UserGroup };
