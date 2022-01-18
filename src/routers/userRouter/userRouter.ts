import { Router } from 'express';

import { withLogger } from '@app/logger';
import * as functions from './controllers';

const {
  getUserById,
  getAllUsers,
  deleteUserById,
  updateUser,
  createUser,
  login
} = functions;

const router = Router();

const withUserLogger = withLogger('user service');

router
  .get('/', withUserLogger(getAllUsers))
  .get('/:id', withUserLogger(getUserById))
  .delete('/:id', withUserLogger(deleteUserById))
  .put('/:id', withUserLogger(updateUser))
  .post('/', withUserLogger(createUser))
  .post('/login', withUserLogger(login));

export default router;
