import { Request, Response } from 'express';
import { groupService } from '@app/services';
import * as controllers from '../../routers/groupRouter/controllers';
import { v4 } from 'uuid';
import { makeShortId } from '@app/utils';

jest.mock('../../services/groupService');

const mockNextFunction = jest.fn();

const mockRequest = (
  params: Partial<
    Request<Record<string, any>, any, any, any, Record<string, any>>
  >
) => params;

let responseObj = {};

const mockGroups = [
  {
    id: '12345',
    name: 'group',
    permissions: []
  }
];

describe('Testing group controllers', () => {
  afterEach(() => {
    jest.clearAllMocks();
    responseObj = {};
  });

  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockImplementation((r) => (responseObj = r))
  };

  describe('getAllGroups', () => {
    describe('fetchGroups rejected', () => {
      it('should call next with error', async () => {
        jest.spyOn(groupService, 'fetchGroups').mockRejectedValue('err');

        await controllers.getAllGroups(
          mockRequest({}) as any,
          res as any,
          mockNextFunction
        );

        expect(mockNextFunction).toBeCalledWith('err');
      });
    });

    describe('fetchGroups rejected', () => {
      it('should call next with error', async () => {
        jest.spyOn(groupService, 'fetchGroups').mockResolvedValue(mockGroups);

        await controllers.getAllGroups(
          mockRequest({}) as any,
          res as any,
          mockNextFunction
        );

        expect(res.json).toBeCalledWith(mockGroups);
      });
    });
  });

  describe('getGroupById', () => {
    const id = v4();

    describe('when group was found', () => {
      const spyFindGroupById = jest
        .spyOn(groupService, 'findGroup')
        .mockResolvedValueOnce(mockGroups[0]);

      it('should return group', async () => {
        await controllers.getGroupById(
          { params: { id } } as any,
          res as any,
          mockNextFunction
        );
        expect(spyFindGroupById).toBeCalledWith(id);
        expect(responseObj).toEqual(mockGroups[0]);
      });
    });

    describe('when group was not found', () => {
      jest.spyOn(groupService, 'findGroup').mockResolvedValueOnce(null);

      it('should return emty object', async () => {
        await controllers.getGroupById(
          { params: { id } } as any,
          res as any,
          mockNextFunction
        );

        expect(responseObj).toEqual({});
      });
    });

    describe('when findGroupById was rejected', () => {
      jest.spyOn(groupService, 'findGroup').mockRejectedValueOnce('error');

      it('should return rejection error', async () => {
        await controllers.getGroupById(
          { params: { id } } as any,
          res as any,
          mockNextFunction
        );

        expect(mockNextFunction).toBeCalledWith('error');
      });
    });
  });

  describe('deleteGroupById', () => {
    const id = v4();

    describe('when group was deleted', () => {
      const spyUpdateGroup = jest
        .spyOn(groupService, 'deleteGroup')
        .mockResolvedValueOnce(1);

      it('should delete group', async () => {
        await controllers.deleteGroupById(
          { params: { id } } as any,
          res as any,
          mockNextFunction
        );

        expect(spyUpdateGroup).toBeCalledWith(id);
        expect(res.json).toBeCalledWith(
          `Group with id ${ makeShortId(id) } was successfully deleted.`
        );
      });
    });

    describe('when group was not found', () => {
      jest.spyOn(groupService, 'deleteGroup').mockResolvedValueOnce(0);

      it('should send response with "...not found" text', async () => {
        await controllers.deleteGroupById(
          { params: { id } } as any,
          res as any,
          mockNextFunction
        );

        expect(res.json).toBeCalledWith(
          `Group with id ${ makeShortId(id) } was not found.`
        );
      });
    });

    describe('when update in db was rejected or failed', () => {
      jest
        .spyOn(groupService, 'deleteGroup')
        .mockRejectedValueOnce('Big fat error');

      it('should call NextFunction with error text', async () => {
        await controllers.deleteGroupById(
          { params: { id } } as any,
          res as any,
          mockNextFunction
        );

        expect(mockNextFunction).toBeCalledWith('Big fat error');
      });
    });
  });

  describe('updateGroup', () => {
    const id = v4();

    describe('when group was updated', () => {
      const spyUpdateGroup = jest
        .spyOn(groupService, 'updateGroup')
        .mockResolvedValueOnce([1] as any);

      it('should update group and return count of updated rows (1)', async () => {
        await controllers.updateGroup(
          { params: { id }, body: { ...mockGroups[0] } } as any,
          res as any,
          mockNextFunction
        );

        expect(spyUpdateGroup).toBeCalledWith(id, { ...mockGroups[0] });
        expect(res.json).toBeCalledWith(
          `Group with id ${ makeShortId(id) } was successfully updated.`
        );
      });
    });

    describe('when group was not found', () => {
      jest.spyOn(groupService, 'updateGroup').mockResolvedValueOnce([0] as any);

      it('should send response with "...not updated" text', async () => {
        await controllers.updateGroup(
          { params: { id } } as any,
          res as any,
          mockNextFunction
        );

        expect(res.json).toBeCalledWith(
          `Group with id ${ makeShortId(id) } was not updated.`
        );
      });
    });

    describe('when update in db was rejected or failed', () => {
      jest
        .spyOn(groupService, 'updateGroup')
        .mockRejectedValueOnce('Big fat error');

      it('should call NextFunction with error text', async () => {
        await controllers.updateGroup(
          { params: { id } } as any,
          res as any,
          mockNextFunction
        );

        expect(mockNextFunction).toBeCalledWith('Big fat error');
      });
    });
  });

  describe('createNewGroup', () => {
    const id = v4();

    describe('when group was created', () => {
      jest.spyOn(groupService, 'createGroup').mockResolvedValue({
        ...mockGroups[0],
        id
      } as any);

      it('should create new group with passed id and info', async () => {
        await controllers.createNewGroup(
          {
            body: {
              ...mockGroups[0]
            }
          } as any,
          res as any,
          mockNextFunction
        );

        expect(res.json).toBeCalledWith(
          `Group ${
            mockGroups[0].name
          } successfully created with id ${ makeShortId(id) }`
        );
      });
    });

    describe('when group was not created', () => {
      it('should call nextFunction with error', async () => {
        jest
          .spyOn(groupService, 'createGroup')
          .mockRejectedValueOnce('Big fat error');
        await controllers.createNewGroup(
          {
            body: {
              ...mockGroups[0]
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
