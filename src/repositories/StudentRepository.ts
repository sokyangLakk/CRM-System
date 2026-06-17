import pool from '../Config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Student } from '../Models/Student';

export class StudentRepository {
  static async create(student: Student): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO students (user_id, name, student_number, class_id, email, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [student.user_id || null, student.name, student.student_number, student.class_id || null, student.email || null, student.phone || null, student.status || 'active']
    );
    return result.insertId;
  }

  static async findById(id: number): Promise<Student | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM students WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as Student) : null;
  }

  static async findProfileById(id: number): Promise<any | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT s.*, c.class_name, t.name as advisor_name 
       FROM students s 
       LEFT JOIN classes c ON s.class_id = c.id
       LEFT JOIN teachers t ON c.advisor_id = t.id
       WHERE s.id = ?`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async findByUserId(userId: number): Promise<Student | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM students WHERE user_id = ?',
      [userId]
    );
    return rows.length > 0 ? (rows[0] as Student) : null;
  }

  static async findByStudentNumber(studentNumber: string): Promise<Student | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM students WHERE student_number = ?',
      [studentNumber]
    );
    return rows.length > 0 ? (rows[0] as Student) : null;
  }

  static async update(id: number, data: Partial<Student>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.name) { fields.push('name = ?'); values.push(data.name); }
    if (data.student_number) { fields.push('student_number = ?'); values.push(data.student_number); }
    if (data.class_id !== undefined) { fields.push('class_id = ?'); values.push(data.class_id); }
    if (data.email !== undefined) { fields.push('email = ?'); values.push(data.email); }
    if (data.phone !== undefined) { fields.push('phone = ?'); values.push(data.phone); }
    if (data.status) { fields.push('status = ?'); values.push(data.status); }
    if (data.user_id !== undefined) { fields.push('user_id = ?'); values.push(data.user_id); }

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE students SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM students WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async findAll(): Promise<(Student & { class_name?: string })[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT s.*, c.class_name 
       FROM students s 
       LEFT JOIN classes c ON s.class_id = c.id`
    );
    return rows as (Student & { class_name?: string })[];
  }
}
