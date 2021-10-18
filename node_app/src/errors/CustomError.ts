import { RESPONSE_STATUS } from "../constants";

export default class CustomError extends Error {
  statusCode: number;

  constructor(message: Error['message']) {
    super(message);
    this.name = 'Resource error';
    this.statusCode = RESPONSE_STATUS.SERVER_ERR;
  }
}
