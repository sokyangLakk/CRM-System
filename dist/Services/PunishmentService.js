import { PunishmentRecordRepository } from '../repositories/PunishmentRecordRepository';
import { StudentRepository } from '../repositories/StudentRepository';
import { TeacherRepository } from '../repositories/TeacherRepository';
import { ActivityLogRepository } from '../repositories/ActivityLogRepository';
import { NotificationService } from './NotificationService';
export class PunishmentService {
    static async issuePunishmentService(data, editorRole, editorUserId, ipAddress) {
        const student = await StudentRepository.findById(data.student_id);
        if (!student) {
            throw new Error('Student not found');
        }
        // Find the teacher profile of the currently logged-in user if applicable
        let teacherId = null;
        if (editorRole === 'teacher' && editorUserId) {
            const teacher = await TeacherRepository.findByUserId(editorUserId);
            teacherId = teacher?.id || null;
        }
        const recordId = await this.issuePunishment({
            student_id: data.student_id,
            offense: data.offense,
            punishment_type: data.punishment_type,
            points_deducted: data.points_deducted ?? 10,
            status: 'pending',
            created_by: teacherId
        });
        // Send mock notification
        if (student.email) {
            await NotificationService.notifyStudentPunishment(student.name, student.email, data.offense, data.punishment_type, data.points_deducted ?? 10);
        }
        if (editorUserId) {
            await ActivityLogRepository.create({
                user_id: editorUserId,
                action: 'ISSUE_PUNISHMENT',
                description: `Issued punishment to student ${student.name}. Offense: ${data.offense}. Deducted points: ${data.points_deducted ?? 10}`,
                ip_address: ipAddress || null
            });
        }
        return recordId;
    }
    static async resolvePunishmentService(recordId, status, editorUserId, ipAddress) {
        const success = await this.resolvePunishment(recordId, status);
        if (success && editorUserId) {
            await ActivityLogRepository.create({
                user_id: editorUserId,
                action: 'RESOLVE_PUNISHMENT',
                description: `Resolved punishment record ${recordId} with status: ${status}`,
                ip_address: ipAddress || null
            });
        }
        return success;
    }
    static async getAllPunishments() {
        return await PunishmentRecordRepository.findAll();
    }
    // --- Base Logic ---
    static async issuePunishment(record) {
        const recordId = await PunishmentRecordRepository.create(record);
        const studentRecords = await PunishmentRecordRepository.findByStudentId(record.student_id);
        const totalDeducted = studentRecords
            .filter((r) => r.status !== 'appealed')
            .reduce((sum, r) => sum + (r.points_deducted || 0), 0);
        if (totalDeducted >= 100) {
            await StudentRepository.update(record.student_id, { status: 'suspended' });
        }
        return recordId;
    }
    static async resolvePunishment(recordId, status) {
        const record = await PunishmentRecordRepository.findById(recordId);
        if (!record)
            return false;
        const success = await PunishmentRecordRepository.update(recordId, { status });
        if (success && status === 'appealed') {
            const student = await StudentRepository.findById(record.student_id);
            if (student && student.status === 'suspended') {
                const studentRecords = await PunishmentRecordRepository.findByStudentId(record.student_id);
                const totalDeducted = studentRecords
                    .filter((r) => r.status !== 'appealed')
                    .reduce((sum, r) => sum + (r.points_deducted || 0), 0);
                if (totalDeducted < 100) {
                    await StudentRepository.update(record.student_id, { status: 'active' });
                }
            }
        }
        return success;
    }
}
