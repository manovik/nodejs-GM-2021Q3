import { NextFunction } from 'express';
import { IncomingMessage } from 'http';
import { ValidationErrorHandler } from '../errors';
import { userDeleteSchema, userPostSchema, userPutSchema } from './schemas';

interface IValidator {
  getMethod(req: IncomingMessage): string | undefined;
  get(next: NextFunction): void;
  post(next: NextFunction): void;
  delete(next: NextFunction): void;
  put(next: NextFunction): void;
}

export default class Validator implements IValidator {
  req: any;

  res: any;

  getMethod = (req: IncomingMessage) => {
    return req?.method?.toLowerCase();
  };

  validate = () => (req: IncomingMessage, res: any, next: NextFunction) => {
    const method = this.getMethod(req);

    this.req = req;
    this.res = res;
    if (method && method in this) {
      this[method as 'get' | 'post' | 'delete' | 'put'](next); // TODO: need to refactor this
      return;
    }
    next();
  };

  get = (next: NextFunction): void => {
    next();
  };

  post = (next: NextFunction): void => {
    const { error } = userPostSchema.validate(this.req?.body);

    if (error) {
      const customError = new ValidationErrorHandler(error.message);

      next(customError);
      return;
    }
    next();
  };

  delete = (next: NextFunction): void => {
    const { error } = userDeleteSchema.validate(this.req?.pathParameter);

    if (error) {
      const customError = new ValidationErrorHandler(error.message);

      next(customError);
      return;
    }
    next();
  };

  put = (next: NextFunction): void => {
    const { error } = userPutSchema.validate(this.req?.body);

    if (error) {
      const customError = new ValidationErrorHandler(error.message);

      next(customError);
      return;
    }
    next();
  };
}
