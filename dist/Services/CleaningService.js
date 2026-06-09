import { CleaningScheduleRepository } from '../repositories/CleaningScheduleRepository';
import { CleaningTaskRepository } from '../repositories/CleaningTaskRepository';
import { CleaningAssignmentRepository } from '../repositories/CleaningAssignmentRepository';
import { StudentRepository } from '../repositories/StudentRepository';
import { ActivityLogRepository } from '../repositories/ActivityLogRepository';
export class CleaningService {
    static async createSchedule(data, editorId, ipAddress) {
        // Set default values if not provided
        const scheduleData = {
            date: data.date,
            day_type: data.day_type || 'normal', // Default to 'normal'
            class_id: data.class_id || 1, // Default to class_id 1
            teacher_id: data.teacher_id || 1, // Default to teacher_id 1
            description: data.description
        };
        const scheduleId = await CleaningScheduleRepository.create(scheduleData);
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
    static async getSchedules() {
        return await CleaningScheduleRepository.findAll();
    }
    static async createTask(data) {
        return await CleaningTaskRepository.create(data);
    }
    static async getTasks() {
        return await CleaningTaskRepository.findAll();
    }
    static async getAssignmentsBySchedule(scheduleId) {
        return await CleaningAssignmentRepository.findByScheduleId(scheduleId);
    }
    static async updateAssignmentStatus(assignmentId, status, pointsEarned, editorId, ipAddress) {
        let success = false;
        if (status === 'completed') {
            success = await this.completeAssignment(assignmentId, pointsEarned ?? 10);
        }
        else if (status === 'missed') {
            success = await this.missAssignment(assignmentId);
        }
        else {
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
    static async autoAssignStudents(scheduleId) {
        const students = await StudentRepository.findAll();
        const activeStudents = students.filter((s) => s.status === 'active');
        const tasks = await CleaningTaskRepository.findAll();
        if (activeStudents.length === 0) {
            throw new Error('No active students available for assignments.');
        }
        if (tasks.length === 0) {
            throw new Error('No cleaning tasks defined.');
        }
        for (const task of tasks) {
            const randomStudent = activeStudents[Math.floor(Math.random() * activeStudents.length)];
            await CleaningAssignmentRepository.create({
                schedule_id: scheduleId,
                student_id: randomStudent.id,
                task_id: task.id,
                status: 'pending',
                points_earned: 0
            });
        }
    }
    static async completeAssignment(assignmentId, earnedPoints) {
        const assignment = await CleaningAssignmentRepository.findById(assignmentId);
        if (!assignment)
            return false;
        return await CleaningAssignmentRepository.update(assignmentId, {
            status: 'completed',
            points_earned: earnedPoints
        });
    }
    static async missAssignment(assignmentId) {
        const assignment = await CleaningAssignmentRepository.findById(assignmentId);
        if (!assignment)
            return false;
        return await CleaningAssignmentRepository.update(assignmentId, {
            status: 'missed',
            points_earned: 0
        });
    }
}
