import pool from '../Config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { CleaningAssignment } from '../Models/CleaningAssignment';

export class CleaningAssignmentRepository {
  static async create(assignment: CleaningAssignment): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO cleaning_assignments (schedule_id, student_id, task_id, status, points_earned) VALUES (?, ?, ?, ?, ?)',
      [assignment.schedule_id, assignment.student_id, assignment.task_id, assignment.status || 'pending', assignment.points_earned ?? 0]
    );
    return result.insertId;
  }

  static async findById(id: number): Promise<CleaningAssignment | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM cleaning_assignments WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as CleaningAssignment) : null;
  }

  static async update(id: number, data: Partial<CleaningAssignment>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.schedule_id !== undefined) { fields.push('schedule_id = ?'); values.push(data.schedule_id); }
    if (data.student_id !== undefined) { fields.push('student_id = ?'); values.push(data.student_id); }
    if (data.task_id !== undefined) { fields.push('task_id = ?'); values.push(data.task_id); }
    if (data.status) { fields.push('status = ?'); values.push(data.status); }
    if (data.points_earned !== undefined) { fields.push('points_earned = ?'); values.push(data.points_earned); }

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE cleaning_assignments SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM cleaning_assignments WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async findByScheduleId(scheduleId: number): Promise<any[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT ca.*, s.name as student_name, s.student_number, t.task_name, t.points 
       FROM cleaning_assignments ca
       JOIN students s ON ca.student_id = s.id
       JOIN cleaning_tasks t ON ca.task_id = t.id
       WHERE ca.schedule_id = ?`,
      [scheduleId]
    );
    return rows;
  }

  static async findByStudentId(studentId: number): Promise<any[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT ca.*, cs.date as schedule_date, t.task_name, t.points 
       FROM cleaning_assignments ca
       JOIN cleaning_schedules cs ON ca.schedule_id = cs.id
       JOIN cleaning_tasks t ON ca.task_id = t.id
       WHERE ca.student_id = ?
       ORDER BY cs.date DESC`,
      [studentId]
    );
    return rows;
  }
}
