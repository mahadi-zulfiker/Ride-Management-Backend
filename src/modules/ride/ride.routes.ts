import { Router } from 'express';
import {
  requestRideController,
  cancelRideController,
  acceptRideController,
  updateRideStatusController,
  getRiderHistoryController,
  getAllRidesController
} from './ride.controller';
import { auth } from '../../middlewares/auth';
import { restrictTo } from '../../middlewares/role';

const router = Router();

router.post('/request', auth, restrictTo('rider'), requestRideController);
router.patch('/:id/cancel', auth, restrictTo('rider'), cancelRideController);
router.patch('/:id/accept', auth, restrictTo('driver'), acceptRideController);
router.patch('/:id/status', auth, restrictTo('driver'), updateRideStatusController);
router.get('/me', auth, restrictTo('rider'), getRiderHistoryController);
router.get('/', auth, restrictTo('admin'), getAllRidesController);

export default router;