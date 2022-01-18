import { ICredentials } from '@app/types';

export const checkForCredentials = (credentials: ICredentials) => {
  const { login, password } = credentials;

  return !!(login && password);
};
