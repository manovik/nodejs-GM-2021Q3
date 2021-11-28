import { Router } from 'express';

import * as functions from './functions';

const { addUsersToGroup } = functions;

const router = Router();

router.post('/', addUsersToGroup);

export default router;
