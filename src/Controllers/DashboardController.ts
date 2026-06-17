import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/AuthMiddleware';
import { ReportService } from '../Services/ReportService';
import { ActivityLogModel } from '../Models/ActivityLog';

export class DashboardController {
  static async getSummaryStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const stats = await ReportService.getDashboardStats();
      res.status(200).json(stats);
    } catch (error: any) {
      res.status(500).json({ message: 'Error generating dashboard statistics', error: error.message });
    }
  }

  static async getClassPerformanceReport(req: AuthenticatedRequest, res: Response): Promise<void> {
    const classId = parseInt(req.params.classId as string);
    try {
      const report = await ReportService.getClassReport(classId);
      res.status(200).json(report);
    } catch (error: any) {
      res.status(500).json({ message: 'Error generating class performance report', error: error.message });
    }
  }

  static async getActivityLogs(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const logs = await ActivityLogModel.findAll();
      res.status(200).json(logs);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching activity logs', error: error.message });
    }
  }
}