import { Request, Response } from 'express';
import { setAvailability, approveDriver, suspendDriver, getEarnings } from './driver.service';
import { logger } from '../../utils/logger';

export const setAvailabilityController = async (req: Request, res: Response) => {
  try {
    const { isOnline } = req.body;
    const user = await setAvailability((req as any).user.id, isOnline);
    res.status(200).json({ message: 'Availability updated', user });
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

export const approveDriverController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const driver = await approveDriver(id);
    res.status(200).json({ message: 'Driver approved', driver });
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

export const suspendDriverController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const driver = await suspendDriver(id);
    res.status(200).json({ message: 'Driver suspended', driver });
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

export const getEarningsController = async (req: Request, res: Response) => {
  try {
    const earnings = await getEarnings((req as any).user.id);
    res.status(200).json(earnings);
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json({ message: error.message });
  }
};