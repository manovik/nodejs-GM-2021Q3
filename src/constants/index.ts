export enum RESPONSE_STATUS {
  OK = 200,
  CREATED = 201,
  DELETED = 202,
  UPDATED = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  SERVER_ERR = 500,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
}

export const loginEndpoint = '/users/login';
