import { Request, Response } from 'express';
import { getAllUsers, blockUser } from './user.service';
import { logger } from '../../utils/logger';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
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