import pool from '../Config/db';
export class CleaningAssignmentRepository {
    static async create(assignment) {
        const [result] = await pool.execute('INSERT INTO cleaning_assignments (schedule_id, student_id, task_id, status, points_earned) VALUES (?, ?, ?, ?, ?)', [assignment.schedule_id, assignment.student_id, assignment.task_id, assignment.status || 'pending', assignment.points_earned ?? 0]);
        return result.insertId;
    }
    static async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM cleaning_assignments WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }
    static async update(id, data) {
        const fields = [];
        const values = [];
        if (data.schedule_id !== undefined) {
            fields.push('schedule_id = ?');
            values.push(data.schedule_id);
        }
        if (data.student_id !== undefined) {
            fields.push('student_id = ?');
            values.push(data.student_id);
        }
        if (data.task_id !== undefined) {
            fields.push('task_id = ?');
            values.push(data.task_id);
        }
        if (data.status) {
            fields.push('status = ?');
            values.push(data.status);
        }
        if (data.points_earned !== undefined) {
            fields.push('points_earned = ?');
            values.push(data.points_earned);
        }
        if (fields.length === 0)
            return false;
        values.push(id);
        const [result] = await pool.execute(`UPDATE cleaning_assignments SET ${fields.join(', ')} WHERE id = ?`, values);
        return result.affectedRows > 0;
    }
    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM cleaning_assignments WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    static async findByScheduleId(scheduleId) {
        const [rows] = await pool.execute(`SELECT ca.*, s.name as student_name, s.student_number, t.task_name, t.points 
       FROM cleaning_assignments ca
       JOIN students s ON ca.student_id = s.id
       JOIN cleaning_tasks t ON ca.task_id = t.id
       WHERE ca.schedule_id = ?`, [scheduleId]);
        return rows;
    }
    static async findByStudentId(studentId) {
        const [rows] = await pool.execute(`SELECT ca.*, cs.date as schedule_date, t.task_name, t.points 
       FROM cleaning_assignments ca
       JOIN cleaning_schedules cs ON ca.schedule_id = cs.id
       JOIN cleaning_tasks t ON ca.task_id = t.id
       WHERE ca.student_id = ?
       ORDER BY cs.date DESC`, [studentId]);
        return rows;
    }
}
