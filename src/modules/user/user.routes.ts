import { Router } from 'express';
import { getUsers, blockUserController } from './user.controller';
import { auth } from '../../middlewares/auth';
import { restrictTo } from '../../middlewares/role';

const router = Router();

router.get('/', auth, restrictTo('admin'), getUsers);
router.patch('/block/:id', auth, restrictTo('admin'), blockUserController);

export default router;