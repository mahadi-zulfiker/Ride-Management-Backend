import { Request, Response, NextFunction } from 'express';

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as any).user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};