import { ClassRepository } from '../repositories/ClassRepository';
import { ActivityLogRepository } from '../repositories/ActivityLogRepository';
import { Class } from '../Models/ClassModel';

export class ClassService {
  static async createClass(data: Class, editorId?: number, ipAddress?: string): Promise<number> {
    const classId = await ClassRepository.create(data);

    if (editorId) {
      await ActivityLogRepository.create({
        user_id: editorId,
        action: 'CREATE_CLASS',
        description: `Created class: ${data.class_name} (ID: ${classId})`,
        ip_address: ipAddress || null
      });
    }

    return classId;
  }

  static async getAllClasses(): Promise<any[]> {
    return await ClassRepository.findAll();
  }

  static async getClassById(id: number): Promise<Class | null> {
    return await ClassRepository.findById(id);
  }

  static async updateClass(id: number, data: Partial<Class>, editorId?: number, ipAddress?: string): Promise<boolean> {
    const cls = await ClassRepository.findById(id);
    if (!cls) {
      throw new Error('Class not found');
    }

    const success = await ClassRepository.update(id, data);

    if (success && editorId) {
      await ActivityLogRepository.create({
        user_id: editorId,
        action: 'UPDATE_CLASS',
        description: `Updated class details for ${cls.class_name} (ID: ${id})`,
        ip_address: ipAddress || null
      });
    }

    return success;
  }

  static async deleteClass(id: number, editorId?: number, ipAddress?: string): Promise<boolean> {
    const cls = await ClassRepository.findById(id);
    if (!cls) {
      throw new Error('Class not found');
    }

    const success = await ClassRepository.delete(id);

    if (success && editorId) {
      await ActivityLogRepository.create({
        user_id: editorId,
        action: 'DELETE_CLASS',
        description: `Deleted class: ${cls.class_name} (ID: ${id})`,
        ip_address: ipAddress || null
      });
    }

    return success;
  }
}
