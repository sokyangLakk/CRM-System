import { ReportService } from './ReportService';
import { ActivityLogRepository } from '../repositories/ActivityLogRepository';
export class DashboardService {
    static async getSummaryStats() {
        return await ReportService.getDashboardStats();
    }
    static async getClassPerformanceReport(classId) {
        return await ReportService.getClassReport(classId);
    }
    static async getActivityLogs() {
        return await ActivityLogRepository.findAll();
    }
}
