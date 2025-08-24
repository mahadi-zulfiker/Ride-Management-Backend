import { Request, Response } from 'express';
import { requestRide, cancelRide, acceptRide, updateRideStatus, getRiderHistory, getAllRides, estimateFare, getAvailableRides, getCurrentRide } from './ride.service';
import { logger } from '../../utils/logger';

export const requestRideController = async (req: Request, res: Response) => {
  try {
    const { pickup, destination, paymentMethod } = req.body;
    const ride = await requestRide((req as any).user.id, pickup, destination, paymentMethod);
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
    const { page = 1, limit = 10, status, fromDate, toDate, minFare, maxFare } = req.query;
    const filter: any = {};
    if (status) filter.status = status;
    if (fromDate || toDate) filter.createdAt = {};
    if (fromDate) filter.createdAt.$gte = new Date(fromDate as string);
    if (toDate) filter.createdAt.$lte = new Date(toDate as string);
    if (minFare || maxFare) filter.fare = {};
    if (minFare) filter.fare.$gte = Number(minFare);
    if (maxFare) filter.fare.$lte = Number(maxFare);
    const data = await getRiderHistory((req as any).user.id, filter, Number(page), Number(limit));
    res.status(200).json(data);
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

export const getAllRidesController = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status, fromDate, toDate, minFare, maxFare, riderId, driverId } = req.query;
    const filter: any = {};
    if (status) filter.status = status;
    if (fromDate || toDate) filter.createdAt = {};
    if (fromDate) filter.createdAt.$gte = new Date(fromDate as string);
    if (toDate) filter.createdAt.$lte = new Date(toDate as string);
    if (minFare || maxFare) filter.fare = {};
    if (minFare) filter.fare.$gte = Number(minFare);
    if (maxFare) filter.fare.$lte = Number(maxFare);
    if (riderId) filter.rider = riderId;
    if (driverId) filter.driver = driverId;
    const data = await getAllRides(filter, Number(page), Number(limit));
    res.status(200).json(data);
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

export const estimateFareController = async (req: Request, res: Response) => {
  try {
    const { pickup, destination } = req.body;
    const fare = estimateFare(pickup, destination);
    res.status(200).json({ fare });
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

export const getAvailableRidesController = async (req: Request, res: Response) => {
  try {
    const rides = await getAvailableRides();
    res.status(200).json(rides);
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

export const getCurrentRideController = async (req: Request, res: Response) => {
  try {
    const { user } = req as any;
    const ride = await getCurrentRide(user.id, user.role);
    res.status(200).json(ride);
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json({ message: error.message });
  }
};