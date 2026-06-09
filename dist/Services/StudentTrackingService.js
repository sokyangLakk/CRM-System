import pool from "../Config/db";
export class StudentTrackingService {
    /**
     * Tracks a student's history, aggregating performance scores.
     * Basic score starts at 100.
     * Add points from completed cleaning assignments.
     * Deduct points from punishment records.
     */
    static async getStudentProfile(studentId) {
        const [studentRows] = await pool.execute(`SELECT s.*, c.class_name, t.name as advisor_name 
       FROM students s 
       LEFT JOIN classes c ON s.class_id = c.id
       LEFT JOIN teachers t ON c.advisor_id = t.id
       WHERE s.id = ?`, [studentId]);
        if (studentRows.length === 0)
            return null;
        const student = studentRows[0];
        const [cleaningRows] = await pool.execute(`SELECT ca.*, cs.schedule_date, ct.task_name 
       FROM cleaning_assignments ca
       JOIN cleaning_schedules cs ON ca.schedule_id = cs.id
       JOIN cleaning_tasks ct ON ca.task_id = ct.id
       WHERE ca.student_id = ?
       ORDER BY cs.schedule_date DESC`, [studentId]);
        const [punishmentRows] = await pool.execute(`SELECT pr.*, t.name as teacher_name 
       FROM punishment_records pr
       LEFT JOIN teachers t ON pr.created_by = t.id
       WHERE pr.student_id = ?
       ORDER BY pr.created_at DESC`, [studentId]);
        // Calculate score
        const initialScore = 100;
        const cleaningPoints = cleaningRows.reduce((sum, item) => sum + (item.points_earned || 0), 0);
        const punishmentPoints = punishmentRows
            .filter((item) => item.status !== "appealed")
            .reduce((sum, item) => sum + (item.points_deducted || 0), 0);
        const currentScore = initialScore + cleaningPoints - punishmentPoints;
        return {
            student_info: student,
            score_card: {
                initial_score: initialScore,
                cleaning_bonus: cleaningPoints,
                punishment_penalty: punishmentPoints,
                current_score: currentScore,
            },
            cleaning_history: cleaningRows,
            disciplinary_records: punishmentRows,
        };
    }
}
