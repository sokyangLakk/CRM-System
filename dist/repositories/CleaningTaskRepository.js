import pool from '../Config/db';
export class CleaningTaskRepository {
    static async create(task) {
        const [result] = await pool.execute('INSERT INTO cleaning_tasks (task_name, description, points) VALUES (?, ?, ?)', [task.task_name, task.description || null, task.points ?? 10]);
        return result.insertId;
    }
    static async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM cleaning_tasks WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }
    static async update(id, data) {
        const fields = [];
        const values = [];
        if (data.task_name) {
            fields.push('task_name = ?');
            values.push(data.task_name);
        }
        if (data.description !== undefined) {
            fields.push('description = ?');
            values.push(data.description);
        }
        if (data.points !== undefined) {
            fields.push('points = ?');
            values.push(data.points);
        }
        if (fields.length === 0)
            return false;
        values.push(id);
        const [result] = await pool.execute(`UPDATE cleaning_tasks SET ${fields.join(', ')} WHERE id = ?`, values);
        return result.affectedRows > 0;
    }
    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM cleaning_tasks WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    static async findAll() {
        const [rows] = await pool.execute('SELECT * FROM cleaning_tasks');
        return rows;
    }
}
