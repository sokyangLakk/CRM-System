import pool from '../Config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { ActivityLog } from '../Models/ActivityLog';

export class ActivityLogRepository {
  static async create(log: ActivityLog): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO activity_logs (user_id, action, description, ip_address) VALUES (?, ?, ?, ?)',
      [log.user_id || null, log.action, log.description || null, log.ip_address || null]
    );
    return result.insertId;
  }

  static async findByUserId(userId: number): Promise<ActivityLog[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows as ActivityLog[];
  }

  static async findAll(): Promise<any[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT al.*, u.username, u.role 
       FROM activity_logs al
       LEFT JOIN users u ON al.user_id = u.id
       ORDER BY al.created_at DESC LIMIT 500`
    );
    return rows;
  }
}
