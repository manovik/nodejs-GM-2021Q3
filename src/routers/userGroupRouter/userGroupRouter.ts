import { Router } from 'express';

import { withLogger } from '@app/logger';
import * as functions from './controllers';

const { addUsersToGroup } = functions;

const router = Router();

const withUserGroupsLogger = withLogger('user to group service');

router.post('/', withUserGroupsLogger(addUsersToGroup));

export default router;
