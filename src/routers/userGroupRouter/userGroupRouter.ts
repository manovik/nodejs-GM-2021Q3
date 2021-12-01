import { Router } from 'express';

import * as functions from './controllers';

const { addUsersToGroup } = functions;

const router = Router();

router.post('/', addUsersToGroup);

export default router;
