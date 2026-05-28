import dotenv from 'dotenv';
import app from './app';
import pool from './Config/db';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Test the database connection pool
    const connection = await pool.getConnection();
    console.log('Connected to MySQL successfully');
    connection.release(); // Return connection to the pool

    // Start Express listener
    app.listen(PORT, () => {
      console.log(`Server is listening at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1); // Stop the application
  }
}

startServer();