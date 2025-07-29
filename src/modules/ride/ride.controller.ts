import { Request, Response } from 'express';
import { requestRide, cancelRide, acceptRide, updateRideStatus, getRiderHistory, getAllRides } from './ride.service';
import { logger } from '../../utils/logger';

export const requestRideController = async (req: Request, res: Response) => {
  try {
    const { pickup, destination } = req.body;
    const ride = await requestRide((req as any).user.id, pickup, destination);
    res.status(201).json({ message: 'Ride requested', ride });
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

export const cancelRideController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ride = await cancelRide(id, (req as any).user.id);
    res.status(200).json({ message: 'Ride canceled', ride });
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

export const acceptRideController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ride = await acceptRide(id, (req as any).user.id);
    res.status(200).json({ message: 'Ride accepted', ride });
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

export const updateRideStatusController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const ride = await updateRideStatus(id, (req as any).user.id, status);
    res.status(200).json({ message: 'Ride status updated', ride });
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

export const getRiderHistoryController = async (req: Request, res: Response) => {
  try {
    const rides = await getRiderHistory((req as any).user.id);
    res.status(200).json(rides);
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

export const getAllRidesController = async (req: Request, res: Response) => {
  try {
    const rides = await getAllRides();
    res.status(200).json(rides);
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json({ message: error.message });
  }
};