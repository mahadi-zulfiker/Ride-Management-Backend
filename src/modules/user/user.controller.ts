import { Request, Response } from 'express';
import { getAllUsers, blockUser, updateProfile, changePassword, getAnalytics } from './user.service';
import { logger } from '../../utils/logger';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    const filter: any = {};
    if (role) filter.role = role;
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    const data = await getAllUsers(filter, Number(page), Number(limit));
    res.status(200).json(data);
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

export const blockUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { block } = req.body;
    const user = await blockUser(id, block);
    res.status(200).json({ message: `User ${block ? 'blocked' : 'unblocked'}`, user });
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

export const updateProfileController = async (req: Request, res: Response) => {
  try {
    const user = await updateProfile((req as any).user.id, req.body);
    res.status(200).json({ message: 'Profile updated', user });
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

export const changePasswordController = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const result = await changePassword((req as any).user.id, oldPassword, newPassword);
    res.status(200).json(result);
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

export const getAnalyticsController = async (req: Request, res: Response) => {
  try {
    const data = await getAnalytics();
    res.status(200).json(data);
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json({ message: error.message });
  }
};