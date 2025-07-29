import { Request, Response } from 'express';
import { register, login } from './auth.service';
import { logger } from '../../utils/logger';

export const registerController = async (req: Request, res: Response) => {
  try {
    const user = await register(req.body);
    res.status(201).json({ message: 'User registered', user });
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await login(email, password);
    res.status(200).json({ message: 'Login successful', user, token });
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json({ message: error.message });
  }
};