import { IUser, IUserOutput } from '@app/types';

const mapUserOutput = (users: IUser[]): IUserOutput[] =>
  users?.map(({ login, age, password }) => ({ login, age, password }));

export default mapUserOutput;
