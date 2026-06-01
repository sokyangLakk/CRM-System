import pool from '../Config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { CleaningSchedule } from '../Models/CleaningSchedule';

export class CleaningScheduleRepository {
  static async create(schedule: CleaningSchedule): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO cleaning_schedules (date, description) VALUES (?, ?)',
      [schedule.date, schedule.description || null]
    );
    return result.insertId;
  }

  static async findById(id: number): Promise<CleaningSchedule | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM cleaning_schedules WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as CleaningSchedule) : null;
  }

  static async update(id: number, data: Partial<CleaningSchedule>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.date) { fields.push('date = ?'); values.push(data.date); }
    if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE cleaning_schedules SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM cleaning_schedules WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async findAll(): Promise<CleaningSchedule[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM cleaning_schedules ORDER BY date DESC'
    );
    return rows as CleaningSchedule[];
  }
}
