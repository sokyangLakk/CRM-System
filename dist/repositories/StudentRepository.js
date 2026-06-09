import pool from '../Config/db';
export class StudentRepository {
    static async create(student) {
        const [result] = await pool.execute('INSERT INTO students (user_id, name, student_number, class_id, gender, email, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [student.user_id || null, student.name, student.student_number, student.class_id || null, student.gender || null, student.email || null, student.phone || null, student.status || 'active']);
        return result.insertId;
    }
    static async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM students WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }
    static async findProfileById(id) {
        const [rows] = await pool.execute(`SELECT s.*, c.name as class_name 
       FROM students s 
       LEFT JOIN classes c ON s.class_id = c.id
       WHERE s.id = ?`, [id]);
        return rows.length > 0 ? rows[0] : null;
    }
    static async findByUserId(userId) {
        const [rows] = await pool.execute('SELECT * FROM students WHERE user_id = ?', [userId]);
        return rows.length > 0 ? rows[0] : null;
    }
    static async findByStudentNumber(studentNumber) {
        const [rows] = await pool.execute('SELECT * FROM students WHERE student_number = ?', [studentNumber]);
        return rows.length > 0 ? rows[0] : null;
    }
    static async update(id, data) {
        const fields = [];
        const values = [];
        if (data.name) {
            fields.push('name = ?');
            values.push(data.name);
        }
        if (data.student_number) {
            fields.push('student_number = ?');
            values.push(data.student_number);
        }
        if (data.class_id !== undefined) {
            fields.push('class_id = ?');
            values.push(data.class_id);
        }
        if (data.gender !== undefined) {
            fields.push('gender = ?');
            values.push(data.gender);
        }
        if (data.email !== undefined) {
            fields.push('email = ?');
            values.push(data.email);
        }
        if (data.phone !== undefined) {
            fields.push('phone = ?');
            values.push(data.phone);
        }
        if (data.status) {
            fields.push('status = ?');
            values.push(data.status);
        }
        if (data.user_id !== undefined) {
            fields.push('user_id = ?');
            values.push(data.user_id);
        }
        if (fields.length === 0)
            return false;
        values.push(id);
        const [result] = await pool.execute(`UPDATE students SET ${fields.join(', ')} WHERE id = ?`, values);
        return result.affectedRows > 0;
    }
    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM students WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    static async findAll() {
        const [rows] = await pool.execute(`SELECT s.*, c.name as class_name 
       FROM students s 
       LEFT JOIN classes c ON s.class_id = c.id`);
        return rows;
    }
}
