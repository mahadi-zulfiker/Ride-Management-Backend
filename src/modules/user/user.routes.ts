import { Router } from 'express';
import { getUsers, blockUserController, updateProfileController, changePasswordController, getAnalyticsController } from './user.controller';
import { auth } from '../../middlewares/auth';
import { restrictTo } from '../../middlewares/role';

const router = Router();

router.get('/', auth, restrictTo('admin'), getUsers);
router.patch('/block/:id', auth, restrictTo('admin'), blockUserController);
router.patch('/profile', auth, updateProfileController);
router.post('/change-password', auth, changePasswordController);
router.get('/analytics', auth, restrictTo('admin'), getAnalyticsController);

export default router;