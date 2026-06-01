import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/AuthMiddleware';
import { BaseController } from './BaseController';
import { TeacherService } from '../Services/TeacherService';

class TeacherControllerImpl extends BaseController {
  private static instance: TeacherControllerImpl;

  private constructor() {
    super();
  }

  public static getInstance(): TeacherControllerImpl {
    if (!TeacherControllerImpl.instance) {
      TeacherControllerImpl.instance = new TeacherControllerImpl();
    }
    return TeacherControllerImpl.instance;
  }

  public async getTeachers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const teachers = await TeacherService.getAllTeachers();
      this.sendSuccess(res, teachers);
    } catch (error: any) {
      this.sendError(res, error.message);
    }
  }

  public async getTeacherById(req: AuthenticatedRequest, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string);
    try {
      const teacher = await TeacherService.getTeacherById(id);
      if (!teacher) {
        this.sendNotFound(res, 'Teacher not found');
        return;
      }
      this.sendSuccess(res, teacher);
    } catch (error: any) {
      this.sendError(res, error.message);
    }
  }

  public async updateTeacher(req: AuthenticatedRequest, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string);
    try {
      await TeacherService.updateTeacher(id, req.body, req.user?.id, req.ip);
      this.sendSuccess(res, null, 'Teacher profile updated successfully');
    } catch (error: any) {
      this.sendError(res, error.message, 400);
    }
  }

  public async deleteTeacher(req: AuthenticatedRequest, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string);
    try {
      await TeacherService.deleteTeacher(id, req.user?.id, req.ip);
      this.sendSuccess(res, null, 'Teacher deleted successfully');
    } catch (error: any) {
      this.sendError(res, error.message, 400);
    }
  }
}

const teacherControllerInstance = TeacherControllerImpl.getInstance();
export const TeacherControllerWrapper = {
  getTeachers: (req: AuthenticatedRequest, res: Response) => teacherControllerInstance.getTeachers(req, res),
  getTeacherById: (req: AuthenticatedRequest, res: Response) => teacherControllerInstance.getTeacherById(req, res),
  updateTeacher: (req: AuthenticatedRequest, res: Response) => teacherControllerInstance.updateTeacher(req, res),
  deleteTeacher: (req: AuthenticatedRequest, res: Response) => teacherControllerInstance.deleteTeacher(req, res)
};
export { TeacherControllerWrapper as TeacherController };
