import { IUser } from '.';

export type IUserOutput = Omit<IUser, 'id' | 'isDeleted'>;
