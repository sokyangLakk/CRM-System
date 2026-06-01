import { TeacherRepository } from '../repositories/TeacherRepository';
import { UserRepository } from '../repositories/UserRepository';
import { ActivityLogRepository } from '../repositories/ActivityLogRepository';
import { Teacher } from '../Models/Teacher';

export class TeacherService {
  static async getAllTeachers(): Promise<Teacher[]> {
    return await TeacherRepository.findAll();
  }

  static async getTeacherById(id: number): Promise<Teacher | null> {
    return await TeacherRepository.findById(id);
  }

  static async updateTeacher(id: number, data: Partial<Teacher>, editorId?: number, ipAddress?: string): Promise<boolean> {
    const teacher = await TeacherRepository.findById(id);
    if (!teacher) {
      throw new Error('Teacher not found');
    }

    const success = await TeacherRepository.update(id, data);

    if (success && teacher.user_id && data.email) {
      await UserRepository.update(teacher.user_id, { email: data.email });
    }

    if (success && editorId) {
      await ActivityLogRepository.create({
        user_id: editorId,
        action: 'UPDATE_TEACHER',
        description: `Updated teacher details for ${teacher.name} (ID: ${id})`,
        ip_address: ipAddress || null
      });
    }

    return success;
  }

  static async deleteTeacher(id: number, editorId?: number, ipAddress?: string): Promise<boolean> {
    const teacher = await TeacherRepository.findById(id);
    if (!teacher) {
      throw new Error('Teacher not found');
    }

    const success = await TeacherRepository.delete(id);
    if (success && teacher.user_id) {
      await UserRepository.delete(teacher.user_id);
    }

    if (success && editorId) {
      await ActivityLogRepository.create({
        user_id: editorId,
        action: 'DELETE_TEACHER',
        description: `Deleted teacher: ${teacher.name} (ID: ${id})`,
        ip_address: ipAddress || null
      });
    }

    return success;
  }
}
