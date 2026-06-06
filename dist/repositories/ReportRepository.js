import pool from '../Config/db';
export class ReportRepository {
    static async getDashboardStats() {
        const [studentStats] = await pool.execute(`SELECT 
         COUNT(*) as total_students,
         SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_students,
         SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspended_students
       FROM students`);
        const [classStats] = await pool.execute('SELECT COUNT(*) as total_classes FROM classes');
        const [teacherStats] = await pool.execute('SELECT COUNT(*) as total_teachers FROM teachers');
        const [assignmentStats] = await pool.execute(`SELECT 
         COUNT(*) as total_assignments,
         SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_assignments,
         SUM(CASE WHEN status = 'missed' THEN 1 ELSE 0 END) as missed_assignments,
         SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_assignments
       FROM cleaning_assignments`);
        const [punishmentStats] = await pool.execute(`SELECT 
         COUNT(*) as total_punishments,
         SUM(points_deducted) as total_deducted_points
       FROM punishment_records
       WHERE status != 'appealed'`);
        return {
            studentStats: studentStats[0],
            classStats: classStats[0],
            teacherStats: teacherStats[0],
            assignmentStats: assignmentStats[0],
            punishmentStats: punishmentStats[0]
        };
    }
    static async getClassReportStudents(classId) {
        const [students] = await pool.execute(`SELECT id, name, student_number, status 
       FROM students 
       WHERE class_id = ?`, [classId]);
        return students;
    }
    static async getStudentCleaningReport(studentId) {
        const [assignments] = await pool.execute(`SELECT 
         COUNT(*) as total,
         SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
         SUM(points_earned) as points_earned
       FROM cleaning_assignments 
       WHERE student_id = ?`, [studentId]);
        return assignments[0];
    }
    static async getStudentPunishmentReport(studentId) {
        const [punishments] = await pool.execute(`SELECT 
         COUNT(*) as total,
         SUM(points_deducted) as points_deducted
       FROM punishment_records 
       WHERE student_id = ? AND status != 'appealed'`, [studentId]);
        return punishments[0];
    }
}
