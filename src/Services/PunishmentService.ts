import { PunishmentRecordRepository } from "../repositories/PunishmentRecordRepository";
import { StudentRepository } from "../repositories/StudentRepository";
import { TeacherRepository } from "../repositories/TeacherRepository";
import { ActivityLogRepository } from "../repositories/ActivityLogRepository";
import { NotificationService } from "./NotificationService";
import { PunishmentRecord } from "../Models/PunishmentRecord";

export class PunishmentService {
  static async issuePunishmentService(
    data: {
      student_id: number;
      offense: string;
      punishment_type: string;
      points_deducted?: number;
    },
    editorRole?: string,
    editorUserId?: number,
    ipAddress?: string,
  ): Promise<number> {
    const student = await StudentRepository.findById(data.student_id);
    if (!student) {
      throw new Error("Student not found");
    }

    // Find the teacher profile of the currently logged-in user if applicable
    let teacherId = null;
    if (editorRole === "teacher" && editorUserId) {
      const teacher = await TeacherRepository.findByUserId(editorUserId);
      teacherId = teacher?.id || null;
    }

    const recordId = await this.issuePunishment({
      student_id: data.student_id,
      offense: data.offense,
      punishment_type: data.punishment_type,
      points_deducted: data.points_deducted ?? 10,
      status: "pending",
      created_by: teacherId,
    });

    // Send mock notification
    if (student.email) {
      await NotificationService.notifyStudentPunishment(
        student.name,
        student.email,
        data.offense,
        data.punishment_type,
        data.points_deducted ?? 10,
      );
    }

    if (editorUserId) {
      await ActivityLogRepository.create({
        user_id: editorUserId,
        action: "ISSUE_PUNISHMENT",
        description: `Issued punishment to student ${student.name}. Offense: ${data.offense}. Deducted points: ${data.points_deducted ?? 10}`,
        ip_address: ipAddress || null,
      });
    }

    return recordId;
  }

  static async resolvePunishmentService(
    recordId: number,
    status: "completed" | "appealed",
    editorUserId?: number,
    ipAddress?: string,
  ): Promise<boolean> {
    const success = await this.resolvePunishment(recordId, status);

    if (success && editorUserId) {
      await ActivityLogRepository.create({
        user_id: editorUserId,
        action: "RESOLVE_PUNISHMENT",
        description: `Resolved punishment record ${recordId} with status: ${status}`,
        ip_address: ipAddress || null,
      });
    }

    return success;
  }

  static async getAllPunishments(): Promise<any[]> {
    return await PunishmentRecordRepository.findAll();
  }

  // --- Base Logic ---
  static async issuePunishment(record: PunishmentRecord): Promise<number> {
    const recordId = await PunishmentRecordRepository.create(record);

    const studentRecords = await PunishmentRecordRepository.findByStudentId(
      record.student_id,
    );
    const totalDeducted = studentRecords
      .filter((r: any) => r.status !== "appealed")
      .reduce((sum: number, r: any) => sum + (r.points_deducted || 0), 0);

    if (totalDeducted >= 100) {
      await StudentRepository.update(record.student_id, { status: "inactive" });
    }

    return recordId;
  }

  static async resolvePunishment(
    recordId: number,
    status: "completed" | "appealed",
  ): Promise<boolean> {
    const record = await PunishmentRecordRepository.findById(recordId);
    if (!record) return false;

    const success = await PunishmentRecordRepository.update(recordId, {
      status,
    });

    if (success && status === "appealed") {
      const student = await StudentRepository.findById(record.student_id);
      if (student && student.status === "inactive") {
        const studentRecords = await PunishmentRecordRepository.findByStudentId(
          record.student_id,
        );
        const totalDeducted = studentRecords
          .filter((r: any) => r.status !== "appealed")
          .reduce((sum: number, r: any) => sum + (r.points_deducted || 0), 0);

        if (totalDeducted < 100) {
          await StudentRepository.update(record.student_id, {
            status: "active",
          });
        }
      }
    }

    return success;
  }
}
