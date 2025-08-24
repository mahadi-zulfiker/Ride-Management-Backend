import { Router } from 'express';
import { setAvailabilityController, approveDriverController, suspendDriverController, getEarningsController } from './driver.controller';
import { auth } from '../../middlewares/auth';
import { restrictTo } from '../../middlewares/role';

const router = Router();

router.patch('/availability', auth, restrictTo('driver'), setAvailabilityController);
router.patch('/approve/:id', auth, restrictTo('admin'), approveDriverController);
router.patch('/suspend/:id', auth, restrictTo('admin'), suspendDriverController);
router.get('/earnings', auth, restrictTo('driver'), getEarningsController);

export default router;