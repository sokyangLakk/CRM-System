import { StudentRepository } from '../repositories/StudentRepository';
import { UserRepository } from '../repositories/UserRepository';
import { ActivityLogRepository } from '../repositories/ActivityLogRepository';
import { Student } from '../Models/Student';

export class StudentService {
  static async getAllStudents(): Promise<Student[]> {
    return await StudentRepository.findAll();
  }

  static async getStudentById(id: number): Promise<Student | null> {
    return await StudentRepository.findById(id);
  }

  static async updateStudent(id: number, data: Partial<Student>, editorId?: number, ipAddress?: string): Promise<boolean> {
    const student = await StudentRepository.findById(id);
    if (!student) {
      throw new Error('Student not found');
    }

    const success = await StudentRepository.update(id, data);

    if (success && student.user_id && (data.email || data.name)) {
      await UserRepository.update(student.user_id, {
        email: data.email || undefined,
        username: data.name ? data.name.toLowerCase().replace(/\s+/g, '') : undefined
      });
    }

    if (success && editorId) {
      await ActivityLogRepository.create({
        user_id: editorId,
        action: 'UPDATE_STUDENT',
        description: `Updated profile for student: ${student.name} (ID: ${id})`,
        ip_address: ipAddress || null
      });
    }

    return success;
  }

  static async deleteStudent(id: number, editorId?: number, ipAddress?: string): Promise<boolean> {
    const student = await StudentRepository.findById(id);
    if (!student) {
      throw new Error('Student not found');
    }

    const success = await StudentRepository.delete(id);
    if (success && student.user_id) {
      await UserRepository.delete(student.user_id);
    }

    if (success && editorId) {
      await ActivityLogRepository.create({
        user_id: editorId,
        action: 'DELETE_STUDENT',
        description: `Deleted student: ${student.name} (ID: ${id})`,
        ip_address: ipAddress || null
      });
    }

    return success;
  }
}
