import { Router } from 'express';
import {
  requestRideController,
  cancelRideController,
  acceptRideController,
  updateRideStatusController,
  getRiderHistoryController,
  getAllRidesController,
  estimateFareController,
  getAvailableRidesController,
  getCurrentRideController
} from './ride.controller';
import { auth } from '../../middlewares/auth';
import { restrictTo } from '../../middlewares/role';

const router = Router();

router.post('/estimate-fare', auth, restrictTo('rider'), estimateFareController);
router.post('/request', auth, restrictTo('rider'), requestRideController);
router.patch('/:id/cancel', auth, restrictTo('rider'), cancelRideController);
router.patch('/:id/accept', auth, restrictTo('driver'), acceptRideController);
router.patch('/:id/status', auth, restrictTo('driver'), updateRideStatusController);
router.get('/me', auth, restrictTo('rider'), getRiderHistoryController);
router.get('/', auth, restrictTo('admin'), getAllRidesController);
router.get('/available', auth, restrictTo('driver'), getAvailableRidesController);
router.get('/current', auth, restrictTo('rider', 'driver'), getCurrentRideController);

export default router;