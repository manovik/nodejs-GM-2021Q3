import { RESPONSE_STATUS } from '@app/constants';

export default class CustomError extends Error {
  statusCode: number;

  constructor(message: Error['message'], code?: number) {
    super(message);
    this.name = 'Resource error';
    this.statusCode = code || RESPONSE_STATUS.SERVER_ERR;
  }
}
