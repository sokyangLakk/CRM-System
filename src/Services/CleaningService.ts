import { CleaningScheduleRepository } from '../repositories/CleaningScheduleRepository';
import { CleaningTaskRepository } from '../repositories/CleaningTaskRepository';
import { CleaningAssignmentRepository } from '../repositories/CleaningAssignmentRepository';
import { StudentRepository } from '../repositories/StudentRepository';
import { ActivityLogRepository } from '../repositories/ActivityLogRepository';
import { CleaningSchedule } from '../Models/CleaningSchedule';
import { CleaningTask } from '../Models/CleaningTask';

export class CleaningService {
  static async createSchedule(data: { date: string; description?: string; autoAssign?: boolean }, editorId?: number, ipAddress?: string): Promise<number> {
    const scheduleId = await CleaningScheduleRepository.create({
      date: data.date,
      description: data.description
    });

    if (data.autoAssign) {
      await this.autoAssignStudents(scheduleId);
    }

    if (editorId) {
      await ActivityLogRepository.create({
        user_id: editorId,
        action: 'CREATE_CLEANING_SCHEDULE',
        description: `Created schedule for ${data.date}. Auto-assign: ${!!data.autoAssign}`,
        ip_address: ipAddress || null
      });
    }

    return scheduleId;
  }

  static async getSchedules(): Promise<CleaningSchedule[]> {
    return await CleaningScheduleRepository.findAll();
  }

  static async createTask(data: CleaningTask): Promise<number> {
    return await CleaningTaskRepository.create(data);
  }

  static async getTasks(): Promise<CleaningTask[]> {
    return await CleaningTaskRepository.findAll();
  }

  static async getAssignmentsBySchedule(scheduleId: number): Promise<any[]> {
    return await CleaningAssignmentRepository.findByScheduleId(scheduleId);
  }

  static async updateAssignmentStatus(assignmentId: number, status: string, pointsEarned?: number, editorId?: number, ipAddress?: string): Promise<boolean> {
    let success = false;
    if (status === 'completed') {
      success = await this.completeAssignment(assignmentId, pointsEarned ?? 10);
    } else if (status === 'missed') {
      success = await this.missAssignment(assignmentId);
    } else {
      success = await CleaningAssignmentRepository.update(assignmentId, { status: 'pending', points_earned: 0 });
    }

    if (success && editorId) {
      await ActivityLogRepository.create({
        user_id: editorId,
        action: 'UPDATE_CLEANING_STATUS',
        description: `Updated assignment ${assignmentId} to status: ${status}`,
        ip_address: ipAddress || null
      });
    }

    return success;
  }

  /**
   * Automatically assigns active students to a cleaning schedule.
   * Cycles through active students to ensure fair distribution.
   */
  static async autoAssignStudents(scheduleId: number): Promise<void> {
    const students = await StudentRepository.findAll();
    const activeStudents = students.filter((s: any) => s.status === 'active');
    const tasks = await CleaningTaskRepository.findAll();

    if (activeStudents.length === 0) {
      throw new Error('No active students available for assignments.');
    }
    if (tasks.length === 0) {
      throw new Error('No cleaning tasks defined.');
    }

    // For simplicity, we randomly assign active students to each task.
    for (const task of tasks) {
      const randomStudent = activeStudents[Math.floor(Math.random() * activeStudents.length)];
      await CleaningAssignmentRepository.create({
        schedule_id: scheduleId,
        student_id: randomStudent.id!,
        task_id: task.id!,
        status: 'pending',
        points_earned: 0
      });
    }
  }

  static async completeAssignment(assignmentId: number, earnedPoints: number): Promise<boolean> {
    const assignment = await CleaningAssignmentRepository.findById(assignmentId);
    if (!assignment) return false;

    return await CleaningAssignmentRepository.update(assignmentId, {
      status: 'completed',
      points_earned: earnedPoints
    });
  }

  static async missAssignment(assignmentId: number): Promise<boolean> {
    const assignment = await CleaningAssignmentRepository.findById(assignmentId);
    if (!assignment) return false;

    return await CleaningAssignmentRepository.update(assignmentId, {
      status: 'missed',
      points_earned: 0
    });
  }
}
