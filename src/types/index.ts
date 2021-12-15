export type IPermission =
  | 'READ'
  | 'WRITE'
  | 'DELETE'
  | 'SHARE'
  | 'UPLOAD_FILES';

export type IContextData = {
  method: string;
  host: string | undefined;
  url: string;
  body: unknown;
  query: { limit: string; loginSubstring: string };
  params: unknown;
  corId: string;
};

export type IRequestInfo = {
  requestId: string;
  data: IContextData;
};

export type IGroup = {
  id: string;
  name: string;
  permissions: Array<IPermission>;
};

export interface IUser {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
}

export interface IUserGroup {
  userId: string;
  groupId: string;
}

export interface IUserGroupRequest extends Omit<IUserGroup, 'userId'> {
  userIds: string[];
}

export type IUserOutput = Omit<IUser, 'id' | 'isDeleted'>;

export interface ICredentials {
  login: string;
  password: string;
}
