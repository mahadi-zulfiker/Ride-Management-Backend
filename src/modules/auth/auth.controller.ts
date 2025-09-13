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
    console.log('Login request body:', req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const { user, token } = await login(email, password);
    res.status(200).json({ message: 'Login successful', user, token, success: true });
  } catch (error: any) {
    console.log('Login error:', error.message);
    logger.error(error.message);
    res.status(400).json({ message: error.message });
  }
};