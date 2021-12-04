export interface IUserGroup {
  userId: string;
  groupId: string;
}

export interface IUserGroupRequest extends Omit<IUserGroup, 'userId'> {
  userIds: string[];
}
