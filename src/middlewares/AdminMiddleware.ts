import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './AuthMiddleware';

export function adminMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({ message: 'Forbidden: Admin access required' });
    return;
  }

  next();
}

export function teacherOrAdminMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
    res.status(403).json({ message: 'Forbidden: Teacher or Admin access required' });
    return;
  }

  next();
}
