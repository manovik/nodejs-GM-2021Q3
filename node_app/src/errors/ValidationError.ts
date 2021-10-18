import { RESPONSE_STATUS } from "../constants";

export default class ValidationErrorHandler extends Error {
  statusCode: number;

  constructor(message: Error['message']) {
    super(message);
    this.name = 'Validation error';
    this.statusCode = RESPONSE_STATUS.BAD_REQUEST;
  }
}
