import db from '../Config/db'; 
import { CleaningSchedule } from '../Models/CleaningSchedule.js';

export class CleaningScheduleRepository {
  
  static async create(data: { 
    date: string; 
    day_type: string;
    class_id: number; 
    teacher_id: number; 
    description?: string 
  }): Promise<number> {
    const query = `INSERT INTO cleaning_schedules (schedule_date, day_type, class_id, teacher_id, description, status) 
                   VALUES (?, ?, ?, ?, ?, 'pending')`;
    const [result]: any = await db.execute(query, [
      data.date, 
      data.day_type,
      data.class_id, 
      data.teacher_id, 
      data.description || null
    ]);
    return result.insertId;
  }

  static async findAll(): Promise<CleaningSchedule[]> {
    const query = `SELECT 
                    id,
                    schedule_date as date,
                    day_type,
                    class_id,
                    teacher_id,
                    description,
                    status,
                    created_at
                  FROM cleaning_schedules 
                  ORDER BY schedule_date DESC`;
    const [rows]: any = await db.execute(query);
    return rows;
  }

  static async findById(id: number): Promise<CleaningSchedule | null> {
    const query = `SELECT 
                    id,
                    schedule_date as date,
                    day_type,
                    class_id,
                    teacher_id,
                    description,
                    status,
                    created_at
                  FROM cleaning_schedules 
                  WHERE id = ?`;
    const [rows]: any = await db.execute(query, [id]);
    return rows[0] || null;
  }

  static async update(id: number, data: Partial<CleaningSchedule>): Promise<boolean> {
    const updateData: any = {};
    if (data.date) updateData.schedule_date = data.date;
    if (data.day_type) updateData.day_type = data.day_type;
    if (data.class_id !== undefined) updateData.class_id = data.class_id;
    if (data.teacher_id !== undefined) updateData.teacher_id = data.teacher_id;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status) updateData.status = data.status;
    
    const query = `UPDATE cleaning_schedules SET ? WHERE id = ?`;
    const [result]: any = await db.execute(query, [updateData, id]);
    return result.affectedRows > 0;
  }

  static async updateStatus(id: number, status: string): Promise<boolean> {
    const query = `UPDATE cleaning_schedules SET status = ? WHERE id = ?`;
    const [result]: any = await db.execute(query, [status, id]);
    return result.affectedRows > 0;
  }
}