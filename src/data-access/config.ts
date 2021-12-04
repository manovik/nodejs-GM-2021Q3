import { Options } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const {
  DB_NAME = 'database',
  DB_USER = 'user',
  DB_PASS,
  DB_HOST,
  DB_PORT = '8080',
  DB_DIALECT
} = process.env;

const dbOpts: Options = {
  host: DB_HOST,
  port: parseInt(DB_PORT),
  dialect: <Options['dialect']>DB_DIALECT,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false
    }
  }
};

export const sequelizeConfig = {
  dbName: DB_NAME,
  dbUser: DB_USER,
  dbPass: DB_PASS,
  dbOpts
};
