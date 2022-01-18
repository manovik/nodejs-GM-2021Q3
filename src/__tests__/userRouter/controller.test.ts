import { Request, Response } from 'express';
import { userService } from '@app/services';
import * as controllers from '../../routers/userRouter/controllers';
import { v4 } from 'uuid';
import { makeShortId } from '@app/utils';
import { CustomError } from '@app/errors';
import { User } from '@app/models';

const mockUsers = [
  {
    login: 'login',
    password: 'password',
    age: 20
  }
];

jest.mock('../../services/userService');

const mockNextFunction = jest.fn();

const mockRequest = (
  params: Partial<
    Request<Record<string, any>, any, any, any, Record<string, any>>
  >
) => params;

let responseObj = {};

const mockQueries = [
  {
    params: {
      query: {}
    },
    description: {
      login: 'not passed',
      limit: 10
    },
    result: {
      loginSubstring: undefined,
      limit: 10
    }
  },
  {
    params: {
      query: {
        loginSubstring: 'testLogin',
        limit: '15'
      }
    },
    description: {
      login: 'testLogin',
      limit: '15'
    },
    result: {
      loginSubstring: 'testLogin',
      limit: 15
    }
  },
  {
    params: {
      query: {
        limit: '12'
      }
    },
    description: {
      login: 'not passed',
      limit: '12'
    },
    result: {
      loginSubstring: undefined,
      limit: 12
    }
  }
];

describe('Testing user controllers', () => {
  afterEach(() => {
    jest.clearAllMocks();
    responseObj = {};
  });

  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockImplementation((r) => (responseObj = r))
  };

  describe('getAllUsers', () => {
    describe('findAllNotDeletedUsers rejected', () => {
      it('should call next with error', async () => {
        jest
          .spyOn(userService, 'findAllNotDeletedUsers')
          .mockRejectedValue('err');
        await controllers.getAllUsers(
          mockRequest(mockQueries[0].params) as any,
          res as any,
          mockNextFunction
        );

        expect(mockNextFunction).toBeCalledWith('err');
      });
    });

    describe.each(mockQueries)(
      'userService.findAllNotDeletedUsers',
      ({ params, description, result }) => {
        it(`should be called with limit: ${ description.limit }, loginSubstring: ${ description.login }`, async () => {
          const spyFindAllNotDeletedUsers = jest
            .spyOn(userService, 'findAllNotDeletedUsers')
            .mockResolvedValue(mockUsers);

          await controllers.getAllUsers(
            mockRequest(params) as any,
            res as any,
            mockNextFunction
          );

          expect(spyFindAllNotDeletedUsers).toBeCalledWith(
            result.limit,
            result.loginSubstring
          );

          expect(responseObj).toEqual(mockUsers);
        });
      }
    );
  });

  describe('getUserById', () => {
    const id = v4();

    describe('when user was found', () => {
      const spyFindUserById = jest
        .spyOn(userService, 'findUserById')
        .mockResolvedValueOnce(mockUsers[0]);

      it('should return user', async () => {
        await controllers.getUserById(
          { params: { id } } as any,
          res as any,
          mockNextFunction
        );
        expect(spyFindUserById).toBeCalledWith(id);
        expect(responseObj).toEqual(mockUsers[0]);
      });
    });

    describe('when user was not found', () => {
      jest.spyOn(userService, 'findUserById').mockResolvedValueOnce(null);

      it('should return emty object', async () => {
        await controllers.getUserById(
          { params: { id } } as any,
          res as any,
          mockNextFunction
        );

        expect(responseObj).toEqual({});
      });
    });

    describe('when findUserById was rejected', () => {
      jest.spyOn(userService, 'findUserById').mockRejectedValueOnce('error');

      it('should return rejection error', async () => {
        await controllers.getUserById(
          { params: { id } } as any,
          res as any,
          mockNextFunction
        );

        expect(mockNextFunction).toBeCalledWith('error');
      });
    });
  });

  describe('deleteUserById', () => {
    const id = v4();

    describe('when user was deleted', () => {
      const spyUpdateUser = jest
        .spyOn(userService, 'updateUser')
        .mockResolvedValueOnce([1] as any);

      it("should update user's isDeleted property and return count of updated rows (1)", async () => {
        await controllers.deleteUserById(
          { params: { id } } as any,
          res as any,
          mockNextFunction
        );

        expect(spyUpdateUser).toBeCalledWith(id, { isDeleted: true });
        expect(res.json).toBeCalledWith(
          `User with id ${ makeShortId(id) } was successfully deleted.`
        );
      });
    });

    describe('when user was not found', () => {
      jest.spyOn(userService, 'updateUser').mockResolvedValueOnce([0] as any);

      it('should throw Custom error and call nextFunction', async () => {
        await controllers.deleteUserById(
          { params: { id } } as any,
          res as any,
          mockNextFunction
        );

        expect(mockNextFunction).toBeCalledWith(
          new CustomError(`Could not find user with id "${ makeShortId(id) }"`)
        );
      });
    });
  });

  describe('updateUser', () => {
    const id = v4();

    describe('when user was updated', () => {
      const spyUpdateUser = jest
        .spyOn(userService, 'updateUser')
        .mockResolvedValueOnce([1] as any);

      it('should update user and return count of updated rows (1)', async () => {
        await controllers.updateUser(
          { params: { id }, body: { ...mockUsers[0] } } as any,
          res as any,
          mockNextFunction
        );

        expect(spyUpdateUser).toBeCalledWith(id, { ...mockUsers[0] });
        expect(res.json).toBeCalledWith(
          `User with id ${ makeShortId(id) } was successfully updated.`
        );
      });
    });

    describe('when user was not found', () => {
      jest.spyOn(userService, 'updateUser').mockResolvedValueOnce([0] as any);

      it('should throw Custom error and call nextFunction', async () => {
        await controllers.updateUser(
          { params: { id } } as any,
          res as any,
          mockNextFunction
        );

        expect(mockNextFunction).toBeCalledWith(
          new CustomError(`Could not find user with id "${ makeShortId(id) }"`)
        );
      });
    });
  });

  describe('createUser', () => {
    const id = v4();

    describe('when user was created', () => {
      jest.spyOn(userService, 'createUser').mockResolvedValue({
        ...mockUsers[0],
        id,
        isDeleted: false
      } as User);
      it('should create new user with passed id and info', async () => {
        await controllers.createUser(
          {
            body: {
              ...mockUsers[0]
            }
          } as any,
          res as any,
          mockNextFunction
        );

        expect(res.json).toBeCalledWith(
          `User ${
            mockUsers[0].login
          } successfully created with id ${ makeShortId(id) }`
        );
      });
    });

    describe('when user was not created', () => {
      it('should call nextFunction with error', async () => {
        jest
          .spyOn(userService, 'createUser')
          .mockRejectedValueOnce('Big fat error');
        await controllers.createUser(
          {
            body: {
              ...mockUsers[0]
            }
          } as any,
          res as any,
          mockNextFunction
        );

        expect(mockNextFunction).toBeCalledWith('Big fat error');
      });
    });
  });

  describe('login', () => {
    const token = v4().replace(/-/g, '.');

    describe('when user was logged in', () => {
      it('should return token', async () => {
        jest.spyOn(userService, 'logUserIn').mockResolvedValue(token);

        await controllers.login(
          {
            body: {
              ...mockUsers[0]
            }
          } as any,
          res as any,
          mockNextFunction
        );

        expect(res.json).toBeCalledWith(token);
      });
    });

    describe('when user was not logged in', () => {
      it('should call nextFunction with error', async () => {
        jest
          .spyOn(userService, 'logUserIn')
          .mockRejectedValueOnce('Big fat error');
        await controllers.login(
          {
            body: {
              ...mockUsers[0]
            }
          } as any,
          res as any,
          mockNextFunction
        );

        expect(mockNextFunction).toBeCalledWith('Big fat error');
      });
    });
  });
});
