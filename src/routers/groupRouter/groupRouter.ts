import { Router } from 'express';

import * as functions from './controllers';

const {
  getAllGroups,
  createNewGroup,
  getGroupById,
  updateGroup,
  deleteGroupById
} = functions;

const router = Router();

router
  .get('/', getAllGroups)
  .get('/:id', getGroupById)
  .delete('/:id', deleteGroupById)
  .put('/:id', updateGroup)
  .post('/', createNewGroup);

export default router;
