import pool from '../Config/db';
import { RowDataPacket } from 'mysql2';

export class ReportService {
  /**
   * Generates a comprehensive dashboard statistics report.
   */
  static async getDashboardStats(): Promise<any> {
    const [studentStats] = await pool.execute<RowDataPacket[]>(
      `SELECT 
         COUNT(*) as total_students,
         SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_students,
         SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspended_students
       FROM students`
    );

    const [classStats] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as total_classes FROM classes'
    );

    const [teacherStats] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as total_teachers FROM teachers'
    );

    const [assignmentStats] = await pool.execute<RowDataPacket[]>(
      `SELECT 
         COUNT(*) as total_assignments,
         SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_assignments,
         SUM(CASE WHEN status = 'missed' THEN 1 ELSE 0 END) as missed_assignments,
         SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_assignments
       FROM cleaning_assignments`
    );

    const [punishmentStats] = await pool.execute<RowDataPacket[]>(
      `SELECT 
         COUNT(*) as total_punishments,
         SUM(points_deducted) as total_deducted_points
       FROM punishment_records
       WHERE status != 'appealed'`
    );

    const totalAssignments = assignmentStats[0].total_assignments || 0;
    const completedAssignments = assignmentStats[0].completed_assignments || 0;
    const complianceRate = totalAssignments > 0 
      ? Math.round((completedAssignments / totalAssignments) * 100) 
      : 100;

    return {
      students: {
        total: studentStats[0].total_students || 0,
        active: studentStats[0].active_students || 0,
        suspended: studentStats[0].suspended_students || 0
      },
      classes: classStats[0].total_classes || 0,
      teachers: teacherStats[0].total_teachers || 0,
      cleaning: {
        total: totalAssignments,
        completed: completedAssignments,
        missed: assignmentStats[0].missed_assignments || 0,
        pending: assignmentStats[0].pending_assignments || 0,
        compliance_rate: `${complianceRate}%`
      },
      discipline: {
        total_records: punishmentStats[0].total_punishments || 0,
        total_points_deducted: punishmentStats[0].total_deducted_points || 0
      }
    };
  }

  /**
   * Generates a monthly behavior and cleaning report for a specific class.
   */
  static async getClassReport(classId: number): Promise<any> {
    const [students] = await pool.execute<RowDataPacket[]>(
      `SELECT id, name, student_number, status 
       FROM students 
       WHERE class_id = ?`,
      [classId]
    );

    const reports = [];

    for (const student of students) {
      const [assignments] = await pool.execute<RowDataPacket[]>(
        `SELECT 
           COUNT(*) as total,
           SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
           SUM(points_earned) as points_earned
         FROM cleaning_assignments 
         WHERE student_id = ?`,
        [student.id]
      );

      const [punishments] = await pool.execute<RowDataPacket[]>(
        `SELECT 
           COUNT(*) as total,
           SUM(points_deducted) as points_deducted
         FROM punishment_records 
         WHERE student_id = ? AND status != 'appealed'`,
        [student.id]
      );

      reports.push({
        student_id: student.id,
        name: student.name,
        student_number: student.student_number,
        status: student.status,
        cleaning: {
          total: assignments[0].total || 0,
          completed: assignments[0].completed || 0,
          points_earned: assignments[0].points_earned || 0
        },
        discipline: {
          total_incidents: punishments[0].total || 0,
          points_deducted: punishments[0].points_deducted || 0
        }
      });
    }

    return reports;
  }
}
