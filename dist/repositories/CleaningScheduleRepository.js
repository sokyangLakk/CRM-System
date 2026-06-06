import pool from '../Config/db';
export class CleaningScheduleRepository {
    static async create(schedule) {
        const [result] = await pool.execute('INSERT INTO cleaning_schedules (date, description) VALUES (?, ?)', [schedule.date, schedule.description || null]);
        return result.insertId;
    }
    static async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM cleaning_schedules WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }
    static async update(id, data) {
        const fields = [];
        const values = [];
        if (data.date) {
            fields.push('date = ?');
            values.push(data.date);
        }
        if (data.description !== undefined) {
            fields.push('description = ?');
            values.push(data.description);
        }
        if (fields.length === 0)
            return false;
        values.push(id);
        const [result] = await pool.execute(`UPDATE cleaning_schedules SET ${fields.join(', ')} WHERE id = ?`, values);
        return result.affectedRows > 0;
    }
    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM cleaning_schedules WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    static async findAll() {
        const [rows] = await pool.execute('SELECT * FROM cleaning_schedules ORDER BY date DESC');
        return rows;
    }
}
