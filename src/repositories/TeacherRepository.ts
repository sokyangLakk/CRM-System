import pool from '../Config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Teacher } from '../Models/Teacher';

export class TeacherRepository {
  static async create(teacher: Teacher): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO teachers (user_id, name, department, email, phone) VALUES (?, ?, ?, ?, ?)',
      [teacher.user_id || null, teacher.name, teacher.department || null, teacher.email, teacher.phone || null]
    );
    return result.insertId;
  }

  static async findById(id: number): Promise<Teacher | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM teachers WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as Teacher) : null;
  }

  static async findByUserId(userId: number): Promise<Teacher | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM teachers WHERE user_id = ?',
      [userId]
    );
    return rows.length > 0 ? (rows[0] as Teacher) : null;
  }

  static async update(id: number, data: Partial<Teacher>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.name) { fields.push('name = ?'); values.push(data.name); }
    if (data.department !== undefined) { fields.push('department = ?'); values.push(data.department); }
    if (data.email) { fields.push('email = ?'); values.push(data.email); }
    if (data.phone !== undefined) { fields.push('phone = ?'); values.push(data.phone); }
    if (data.user_id !== undefined) { fields.push('user_id = ?'); values.push(data.user_id); }

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE teachers SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM teachers WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async findAll(): Promise<Teacher[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM teachers'
    );
    return rows as Teacher[];
  }
}
