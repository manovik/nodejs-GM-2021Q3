import { Permission } from './Permission';

export type IGroup = {
  id: string;
  name: string;
  permissions: Array<Permission>;
};
