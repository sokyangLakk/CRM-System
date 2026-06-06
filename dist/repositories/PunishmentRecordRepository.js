import pool from '../Config/db';
export class PunishmentRecordRepository {
    static async create(record) {
        const [result] = await pool.execute('INSERT INTO punishment_records (student_id, offense, punishment_type, points_deducted, status, created_by) VALUES (?, ?, ?, ?, ?, ?)', [record.student_id, record.offense, record.punishment_type, record.points_deducted ?? 0, record.status || 'pending', record.created_by || null]);
        return result.insertId;
    }
    static async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM punishment_records WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }
    static async update(id, data) {
        const fields = [];
        const values = [];
        if (data.student_id !== undefined) {
            fields.push('student_id = ?');
            values.push(data.student_id);
        }
        if (data.offense) {
            fields.push('offense = ?');
            values.push(data.offense);
        }
        if (data.punishment_type) {
            fields.push('punishment_type = ?');
            values.push(data.punishment_type);
        }
        if (data.points_deducted !== undefined) {
            fields.push('points_deducted = ?');
            values.push(data.points_deducted);
        }
        if (data.status) {
            fields.push('status = ?');
            values.push(data.status);
        }
        if (data.created_by !== undefined) {
            fields.push('created_by = ?');
            values.push(data.created_by);
        }
        if (fields.length === 0)
            return false;
        values.push(id);
        const [result] = await pool.execute(`UPDATE punishment_records SET ${fields.join(', ')} WHERE id = ?`, values);
        return result.affectedRows > 0;
    }
    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM punishment_records WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    static async findByStudentId(studentId) {
        const [rows] = await pool.execute(`SELECT pr.*, t.name as teacher_name 
       FROM punishment_records pr
       LEFT JOIN teachers t ON pr.created_by = t.id
       WHERE pr.student_id = ?
       ORDER BY pr.created_at DESC`, [studentId]);
        return rows;
    }
    static async findAll() {
        const [rows] = await pool.execute(`SELECT pr.*, s.name as student_name, s.student_number, t.name as teacher_name 
       FROM punishment_records pr
       JOIN students s ON pr.student_id = s.id
       LEFT JOIN teachers t ON pr.created_by = t.id
       ORDER BY pr.created_at DESC`);
        return rows;
    }
}
