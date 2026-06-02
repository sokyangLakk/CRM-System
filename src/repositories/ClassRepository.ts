import pool from '../Config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Class } from '../Models/ClassModel';

export class ClassRepository {
  static async create(cls: Class): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO classes (class_name, advisor_id) VALUES (?, ?)',
      [cls.class_name, cls.advisor_id || null]
    );
    return result.insertId;
  }

  static async findById(id: number): Promise<Class | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM classes WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as Class) : null;
  }

  static async update(id: number, data: Partial<Class>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.class_name) { fields.push('class_name = ?'); values.push(data.class_name); }
    if (data.advisor_id !== undefined) { fields.push('advisor_id = ?'); values.push(data.advisor_id); }

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE classes SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM classes WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async findAll(): Promise<(Class & { advisor_name?: string })[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT c.*, t.name as advisor_name 
       FROM classes c 
       LEFT JOIN teachers t ON c.advisor_id = t.id`
    );
    return rows as (Class & { advisor_name?: string })[];
  }
}
