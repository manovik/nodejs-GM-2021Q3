import { loginEndpoint } from '@app/constants';
import { NextFunction, Request, Response } from 'express';
import { ValidationErrorHandler } from '../errors';
import { idSchema, userPostSchema, userPutSchema } from './schemas';

interface IValidator {
  getMethod(req: Request): string;
  get(next: NextFunction): void;
  post(next: NextFunction): void;
  delete(next: NextFunction): void;
  put(next: NextFunction): void;
}

type ValidatorMethods = 'get' | 'post' | 'delete' | 'put';

class Validator implements IValidator {
  req: Request | null = null;

  res: Response | null = null;

  getMethod = (req: Request) => req.method.toLowerCase();

  validate = (req: Request, res: Response, next: NextFunction) => {
    if (req.path.includes('/users')) {
      const method = this.getMethod(req);

      this.req = req;
      this.res = res;

      if (method && method in this) {
        this[<ValidatorMethods>method](next);
        return;
      }
    }
    return next();
  };

  get = (next: NextFunction): void => {
    next();
  };

  post = (next: NextFunction): void => {
    if (this.req?.url === loginEndpoint) return next();
    const { error } = userPostSchema.validate(this.req?.body);

    if (error) {
      const validationError = new ValidationErrorHandler(error.message);

      next(validationError.createMessage());
      return;
    }
    next();
  };

  delete = (next: NextFunction): void => {
    const id = this.req?.path.replace('/', '');
    const { error } = idSchema.validate(id);

    if (error) {
      const validationError = new ValidationErrorHandler(error.message);

      next(validationError.createMessage());
      return;
    }
    next();
  };

  put = (next: NextFunction): void => {
    const id = this.req?.path.replace('/', '');
    const { error: err } = idSchema.validate(id);
    const { error } = userPutSchema.validate(this.req?.body);

    if (error || err) {
      const errors = [ error?.message, err?.message ];
      const validationError = new ValidationErrorHandler(
        errors.filter(Boolean).join('\n')
      );

      next(validationError.createMessage());
      return;
    }
    next();
  };
}

export const validator = new Validator();
