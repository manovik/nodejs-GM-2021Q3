import { Router } from 'express';

import { utils } from './utils';

const { getUserById, getAllUsers, deleteUserById, updateUser, createUser } =
  utils;

const router = Router();

router
  .get('/', getAllUsers)
  .get('/:id', getUserById)
  .delete('/:id', deleteUserById)
  .put('/:id', updateUser)
  .post('/', createUser);

export default router;
