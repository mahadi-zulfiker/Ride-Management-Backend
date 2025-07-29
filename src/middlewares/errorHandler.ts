import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message, err);
  res.status(err.status || 500).json({
    message: err.message || 'Server Error'
  });
};