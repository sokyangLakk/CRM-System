import pool from '../Config/db';
export class TeacherRepository {
    static async create(teacher) {
        const [result] = await pool.execute('INSERT INTO teachers (user_id, name, department, email, phone) VALUES (?, ?, ?, ?, ?)', [teacher.user_id || null, teacher.name, teacher.department || null, teacher.email, teacher.phone || null]);
        return result.insertId;
    }
    static async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM teachers WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }
    static async findByUserId(userId) {
        const [rows] = await pool.execute('SELECT * FROM teachers WHERE user_id = ?', [userId]);
        return rows.length > 0 ? rows[0] : null;
    }
    static async update(id, data) {
        const fields = [];
        const values = [];
        if (data.name) {
            fields.push('name = ?');
            values.push(data.name);
        }
        if (data.department !== undefined) {
            fields.push('department = ?');
            values.push(data.department);
        }
        if (data.email) {
            fields.push('email = ?');
            values.push(data.email);
        }
        if (data.phone !== undefined) {
            fields.push('phone = ?');
            values.push(data.phone);
        }
        if (data.user_id !== undefined) {
            fields.push('user_id = ?');
            values.push(data.user_id);
        }
        if (fields.length === 0)
            return false;
        values.push(id);
        const [result] = await pool.execute(`UPDATE teachers SET ${fields.join(', ')} WHERE id = ?`, values);
        return result.affectedRows > 0;
    }
    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM teachers WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    static async findAll() {
        const [rows] = await pool.execute('SELECT * FROM teachers');
        return rows;
    }
}
