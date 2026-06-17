import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/AuthMiddleware';
import { BaseController } from './BaseController';
import { ClassService } from '../Services/ClassService';

class ClassControllerImpl extends BaseController {
  private static instance: ClassControllerImpl;

  private constructor() {
    super();
  }

  public static getInstance(): ClassControllerImpl {
    if (!ClassControllerImpl.instance) {
      ClassControllerImpl.instance = new ClassControllerImpl();
    }
    return ClassControllerImpl.instance;
  }

  public async createClass(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { class_name } = req.body;

    if (!class_name) {
      this.sendBadRequest(res, 'Class name is required');
      return;
    }

    try {
      const classId = await ClassService.createClass(req.body, req.user?.id, req.ip);
      this.sendSuccess(res, { classId }, 'Class created successfully', 201);
    } catch (error: any) {
      this.sendError(res, error.message);
    }
  }

  public async getClasses(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const classes = await ClassService.getAllClasses();
      this.sendSuccess(res, classes);
    } catch (error: any) {
      this.sendError(res, error.message);
    }
  }

  public async getClassById(req: AuthenticatedRequest, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string);
    try {
      const cls = await ClassService.getClassById(id);
      if (!cls) {
        this.sendNotFound(res, 'Class not found');
        return;
      }
      this.sendSuccess(res, cls);
    } catch (error: any) {
      this.sendError(res, error.message);
    }
  }

  public async updateClass(req: AuthenticatedRequest, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string);
    try {
      await ClassService.updateClass(id, req.body, req.user?.id, req.ip);
      this.sendSuccess(res, null, 'Class updated successfully');
    } catch (error: any) {
      this.sendError(res, error.message, 400);
    }
  }

  public async deleteClass(req: AuthenticatedRequest, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string);
    try {
      await ClassService.deleteClass(id, req.user?.id, req.ip);
      this.sendSuccess(res, null, 'Class deleted successfully');
    } catch (error: any) {
      this.sendError(res, error.message, 400);
    }
  }
}

const classControllerInstance = ClassControllerImpl.getInstance();
export const ClassControllerWrapper = {
  createClass: (req: AuthenticatedRequest, res: Response) => classControllerInstance.createClass(req, res),
  getClasses: (req: AuthenticatedRequest, res: Response) => classControllerInstance.getClasses(req, res),
  getClassById: (req: AuthenticatedRequest, res: Response) => classControllerInstance.getClassById(req, res),
  updateClass: (req: AuthenticatedRequest, res: Response) => classControllerInstance.updateClass(req, res),
  deleteClass: (req: AuthenticatedRequest, res: Response) => classControllerInstance.deleteClass(req, res)
};
export { ClassControllerWrapper as ClassController };
