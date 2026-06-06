import { ReportService } from './ReportService';
import { ActivityLogRepository } from '../repositories/ActivityLogRepository';

export class DashboardService {
  static async getSummaryStats(): Promise<any> {
    return await ReportService.getDashboardStats();
  }

  static async getClassPerformanceReport(classId: number): Promise<any> {
    return await ReportService.getClassReport(classId);
  }

  static async getActivityLogs(): Promise<any[]> {
    return await ActivityLogRepository.findAll();
  }
}
