import pool from '../Config/db';
export class ClassRepository {
    static async create(cls) {
        const [result] = await pool.execute('INSERT INTO classes (class_name, advisor_id) VALUES (?, ?)', [cls.class_name, cls.advisor_id || null]);
        return result.insertId;
    }
    static async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM classes WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }
    static async update(id, data) {
        const fields = [];
        const values = [];
        if (data.class_name) {
            fields.push('class_name = ?');
            values.push(data.class_name);
        }
        if (data.advisor_id !== undefined) {
            fields.push('advisor_id = ?');
            values.push(data.advisor_id);
        }
        if (fields.length === 0)
            return false;
        values.push(id);
        const [result] = await pool.execute(`UPDATE classes SET ${fields.join(', ')} WHERE id = ?`, values);
        return result.affectedRows > 0;
    }
    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM classes WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    static async findAll() {
        const [rows] = await pool.execute(`SELECT c.*, t.name as advisor_name 
       FROM classes c 
       LEFT JOIN teachers t ON c.advisor_id = t.id`);
        return rows;
    }
}
