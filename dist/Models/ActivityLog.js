import pool from '../Config/db';
export class ActivityLogModel {
    static async create(log) {
        const [result] = await pool.execute('INSERT INTO activity_logs (user_id, action, description, ip_address) VALUES (?, ?, ?, ?)', [log.user_id || null, log.action, log.description || null, log.ip_address || null]);
        return result.insertId;
    }
    static async findByUserId(userId) {
        const [rows] = await pool.execute('SELECT * FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        return rows;
    }
    static async findAll() {
        const [rows] = await pool.execute(`SELECT al.*, u.username, u.role 
       FROM activity_logs al
       LEFT JOIN users u ON al.user_id = u.id
       ORDER BY al.created_at DESC LIMIT 500`);
        return rows;
    }
}
