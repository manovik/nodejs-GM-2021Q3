import { RESPONSE_STATUS } from '@app/constants';

const validationErrors = {
  id: 'ID is invalid',
  login: 'Login is invalid',
  password: 'Password is invalid',
  age: 'Age is invalid'
};

export default class ValidationErrorHandler extends Error {
  statusCode: number;

  constructor(message: Error['message']) {
    super(message);
    this.name = 'Validation error';
    this.statusCode = RESPONSE_STATUS.BAD_REQUEST;
  }

  createMessage = () => {
    let message = '';

    for (const [ key, val ] of Object.entries(validationErrors)) {
      if (this.message.includes(key)) {
        message = val;
      }
    }
    this.message = `Validation failed. ${ message ? message : this.message }.`;
    return this;
  };
}
