import { User } from './types';

export const users: User[] = [
  {
    id: '8c5d3b70-cf6c-4c2e-b691-edc12241a643',
    login: 'veronik@',
    password: 'pin3g',
    age: 25,
    isDeleted: false
  },
  {
    id: 'caa04728-2041-4dd7-a875-08814486544b',
    login: 'm@xim',
    password: 'pi23ng',
    age: 31,
    isDeleted: false
  },
  {
    id: '4f0cc1e1-398e-4228-a53c-bd1b798b7917',
    login: '@n$heLik@',
    password: 'pin45g',
    age: 28,
    isDeleted: false
  },
  {
    id: '0d767cd5-a1df-47e9-aa9b-4f76ca7cfd1b',
    login: 'IgAr',
    password: 'pin66g',
    age: 30,
    isDeleted: false
  },
  {
    id: '0e8658f9-a3c7-4237-b950-ce318fd1e292',
    login: 'moneyman',
    password: 'ping12',
    age: 52,
    isDeleted: false
  }
];

export const findUserIndex = (id: string): number => {
  return users.findIndex((u) => u.id === id);
};

export const findUser = (id: string): User | Record<string, unknown> => {
  const user: User | undefined = users.find((u) => u.id === id);

  return (!user?.isDeleted && user) || {};
};

export const getAllNotDeletedUsers = () => users.filter((u) => !u.isDeleted);

export const getAutoSuggestUsers = (
  loginSubstring = '',
  limit: string
): User[] => {
  const users = getAllNotDeletedUsers();
  const start = 0;
  const end = users.length;
  let result: User[];
  const limitNum = limit ? parseInt(limit, 10) : end;

  if (loginSubstring) {
    result = users.filter((u) => {
      return RegExp(loginSubstring, 'g').test(u.login);
    });
  } else {
    return users.slice(start, limitNum);
  }
  return result.slice(start, limitNum);
};
