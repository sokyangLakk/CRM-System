              import { Response } from 'express';
              import { AuthenticatedRequest } from '../middlewares/AuthMiddleware';
              import { StudentModel } from '../Models/Student';
              import { UserModel } from '../Models/User';
            //   import { StudentTrackingService } from '../Services/StudentTrackingService';
            //   import { ActivityLogModel } from '../Models/ActivityLog';

export class StudentController {
  static async getStudents(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const students = await StudentModel.findAll();
      res.status(200).json(students);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching students', error: error.message });
    }
  }

  static async getStudentProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    const studentId = parseInt(req.params.id as string);
    try {
      const profile = await StudentTrackingService.getStudentProfile(studentId);
      if (!profile) {
        res.status(404).json({ message: 'Student profile not found' });
        return;
      }
      res.status(200).json(profile);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching student profile', error: error.message });
    }
  }

  static async updateStudent(req: AuthenticatedRequest, res: Response): Promise<void> {
    const studentId = parseInt(req.params.id as string);
    const { name, student_number, class_id, email, phone, status } = req.body;

    try {
      const student = await StudentModel.findById(studentId);
      if (!student) {
        res.status(404).json({ message: 'Student not found' });
        return;
      }

      const success = await StudentModel.update(studentId, {
        name,
        student_number,
        class_id,
        email,
        phone,
        status
      });

      // Synchronize with User details if associated
      if (student.user_id && (email || name)) {
        await UserModel.update(student.user_id, {
          email,
          username: name ? name.toLowerCase().replace(/\s+/g, '') : undefined
        });
      }

      await ActivityLogModel.create({
        user_id: req.user?.id,
        action: 'UPDATE_STUDENT',
        description: `Updated profile for student: ${student.name} (ID: ${studentId})`,
        ip_address: req.ip
      });

      res.status(200).json({ message: 'Student profile updated successfully' });
    } catch (error: any) {
      res.status(500).json({ message: 'Error updating student profile', error: error.message });
    }
  }

  static async deleteStudent(req: AuthenticatedRequest, res: Response): Promise<void> {
    const studentId = parseInt(req.params.id as string);
    try {
      const student = await StudentModel.findById(studentId);
      if (!student) {
        res.status(404).json({ message: 'Student not found' });
        return;
      }

      await StudentModel.delete(studentId);
      if (student.user_id) {
        await UserModel.delete(student.user_id);
      }

      await ActivityLogModel.create({
        user_id: req.user?.id,
        action: 'DELETE_STUDENT',
        description: `Deleted student: ${student.name} (ID: ${studentId})`,
        ip_address: req.ip
      });

      res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: 'Error deleting student', error: error.message });
    }
  }
}
