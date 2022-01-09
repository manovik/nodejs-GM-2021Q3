import { Router } from 'express';

import { withLogger } from '@app/logger';
import * as functions from './controllers';

const {
  getAllGroups,
  createNewGroup,
  getGroupById,
  updateGroup,
  deleteGroupById
} = functions;

const router = Router();

const withGroupLogger = withLogger('group service');

router
  .get('/', withGroupLogger(getAllGroups))
  .get('/:id', withGroupLogger(getGroupById))
  .delete('/:id', withGroupLogger(deleteGroupById))
  .put('/:id', withGroupLogger(updateGroup))
  .post('/', withGroupLogger(createNewGroup));

export default router;
