import { Router } from 'express';
import { utils } from './utils';

const { getAllUsers, getUserById, deleteUserById, updateUser, createUser } =
  utils;

const router = Router();

router
  .get('/', getAllUsers)
  .get('/:id', getUserById)
  .delete('/:id', deleteUserById)
  .put('/', updateUser)
  .post('/', createUser);

export default router;
