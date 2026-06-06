import pool from '../Config/db';
export class UserRepository {
    static async create(user) {
        const [result] = await pool.execute('INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)', [user.username, user.password || null, user.email, user.role]);
        return result.insertId;
    }
    static async findById(id) {
        const [rows] = await pool.execute('SELECT id, username, email, role, created_at, updated_at FROM users WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }
    static async findByUsername(username) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        return rows.length > 0 ? rows[0] : null;
    }
    static async findByUsernameOrEmail(identifier) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1', [identifier, identifier]);
        return rows.length > 0 ? rows[0] : null;
    }
    static async findByEmail(email) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows.length > 0 ? rows[0] : null;
    }
    static async update(id, data) {
        const fields = [];
        const values = [];
        if (data.username) {
            fields.push('username = ?');
            values.push(data.username);
        }
        if (data.password) {
            fields.push('password = ?');
            values.push(data.password);
        }
        if (data.email) {
            fields.push('email = ?');
            values.push(data.email);
        }
        if (data.role) {
            fields.push('role = ?');
            values.push(data.role);
        }
        if (fields.length === 0)
            return false;
        values.push(id);
        const [result] = await pool.execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
        return result.affectedRows > 0;
    }
    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    static async findAll() {
        const [rows] = await pool.execute('SELECT id, username, email, role, created_at, updated_at FROM users');
        return rows;
    }
}
