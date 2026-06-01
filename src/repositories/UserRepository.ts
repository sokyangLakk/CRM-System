import pool from '../Config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { User } from '../Models/User';

export class UserRepository {
  static async create(user: User): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
      [user.username, user.password || null, user.email, user.role]
    );
    return result.insertId;
  }

  static async findById(id: number): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, username, email, role, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as User) : null;
  }

  static async findByUsername(username: string): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows.length > 0 ? (rows[0] as User) : null;
  }

  static async findByUsernameOrEmail(identifier: string): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1',
      [identifier, identifier]
    );
    return rows.length > 0 ? (rows[0] as User) : null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows.length > 0 ? (rows[0] as User) : null;
  }

  static async update(id: number, data: Partial<User>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.username) { fields.push('username = ?'); values.push(data.username); }
    if (data.password) { fields.push('password = ?'); values.push(data.password); }
    if (data.email) { fields.push('email = ?'); values.push(data.email); }
    if (data.role) { fields.push('role = ?'); values.push(data.role); }

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async findAll(): Promise<User[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, username, email, role, created_at, updated_at FROM users'
    );
    return rows as User[];
  }
}
