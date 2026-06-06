import dotenv from 'dotenv';
import app from './app';
import pool from './Config/db';
dotenv.config();
const PORT = process.env.PORT || 3000;
async function startServer() {
    app.listen(PORT, () => {
        console.log(`Server is listening at http://localhost:${PORT}`);
    });
    try {
        const connection = await pool.getConnection();
        console.log('Connected to MySQL successfully');
        connection.release();
    }
    catch (error) {
        console.error('Database connection failed. Is MySQL running and is .env configured correctly?');
        console.error(error);
    }
}
startServer();
