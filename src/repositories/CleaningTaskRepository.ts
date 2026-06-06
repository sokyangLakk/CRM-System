import pool from "../Config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { CleaningTask } from "../Models/CleaningTask";

export class CleaningTaskRepository {
  static async create(task: CleaningTask): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO cleaning_tasks (task_name, description, points) VALUES (?, ?, ?)",
      [task.task_name, task.description || null, task.points ?? 10],
    );
    return result.insertId;
  }

  static async findById(id: number): Promise<CleaningTask | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM cleaning_tasks WHERE id = ?",
      [id],
    );
    return rows.length > 0 ? (rows[0] as CleaningTask) : null;
  }

  static async update(
    id: number,
    data: Partial<CleaningTask>,
  ): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.task_name) {
      fields.push("task_name = ?");
      values.push(data.task_name);
    }
    if (data.description !== undefined) {
      fields.push("description = ?");
      values.push(data.description);
    }
    if (data.points !== undefined) {
      fields.push("points = ?");
      values.push(data.points);
    }

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE cleaning_tasks SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM cleaning_tasks WHERE id = ?",
      [id],
    );
    return result.affectedRows > 0;
  }

  static async findAll(): Promise<CleaningTask[]> {
    const query = `SELECT 
                  id,
                  task_name,
                  type,
                  description,
                  points,
                  max_students,
                  created_at
                FROM cleaning_tasks 
                ORDER BY id ASC`;
    const [rows]: any = await db.execute(query);
    return rows;
  }
}
