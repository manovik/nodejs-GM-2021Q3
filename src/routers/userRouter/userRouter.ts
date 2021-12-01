import { Router } from 'express';

import * as functions from './controllers';

const { getUserById, getAllUsers, deleteUserById, updateUser, createUser } =
  functions;

const router = Router();

router
  .get('/', getAllUsers)
  .get('/:id', getUserById)
  .delete('/:id', deleteUserById)
  .put('/:id', updateUser)
  .post('/', createUser);

export default router;
