import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/AuthMiddleware';
import { BaseController } from './BaseController';
import { CleaningService } from '../Services/CleaningService';

class CleaningControllerImpl extends BaseController {
  private static instance: CleaningControllerImpl;

  private constructor() {
    super();
  }

  public static getInstance(): CleaningControllerImpl {
    if (!CleaningControllerImpl.instance) {
      CleaningControllerImpl.instance = new CleaningControllerImpl();
    }
    return CleaningControllerImpl.instance;
  }

  public async createSchedule(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { date } = req.body;
    if (!date) {
      this.sendBadRequest(res, 'Date is required.');
      return;
    }

    try {
      const scheduleId = await CleaningService.createSchedule(req.body, req.user?.id, req.ip);
      this.sendSuccess(res, { scheduleId }, 'Cleaning schedule created successfully', 201);
    } catch (error: any) {
      this.sendError(res, error.message);
    }
  }

  public async getSchedules(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const schedules = await CleaningService.getSchedules();
      this.sendSuccess(res, schedules);
    } catch (error: any) {
      this.sendError(res, error.message);
    }
  }

  public async createTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { task_name } = req.body;
    if (!task_name) {
      this.sendBadRequest(res, 'Task name is required.');
      return;
    }

    try {
      const taskId = await CleaningService.createTask(req.body);
      this.sendSuccess(res, { taskId }, 'Cleaning task created successfully', 201);
    } catch (error: any) {
      this.sendError(res, error.message);
    }
  }

  public async getTasks(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const tasks = await CleaningService.getTasks();
      this.sendSuccess(res, tasks);
    } catch (error: any) {
      this.sendError(res, error.message);
    }
  }

  public async getAssignmentsBySchedule(req: AuthenticatedRequest, res: Response): Promise<void> {
    const scheduleId = parseInt(req.params.scheduleId as string);
    try {
      const assignments = await CleaningService.getAssignmentsBySchedule(scheduleId);
      this.sendSuccess(res, assignments);
    } catch (error: any) {
      this.sendError(res, error.message);
    }
  }

  public async updateAssignmentStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    const assignmentId = parseInt(req.params.assignmentId as string);
    const { status, points_earned } = req.body;

    if (!status || !['completed', 'missed', 'pending'].includes(status)) {
      this.sendBadRequest(res, 'Valid status is required ("completed", "missed", "pending").');
      return;
    }

    try {
      const success = await CleaningService.updateAssignmentStatus(assignmentId, status, points_earned, req.user?.id, req.ip);
      if (!success) {
        this.sendNotFound(res, 'Assignment not found');
        return;
      }
      this.sendSuccess(res, null, 'Assignment status updated successfully');
    } catch (error: any) {
      this.sendError(res, error.message);
    }
  }
}

const cleaningControllerInstance = CleaningControllerImpl.getInstance();
export const CleaningControllerWrapper = {
  createSchedule: (req: AuthenticatedRequest, res: Response) => cleaningControllerInstance.createSchedule(req, res),
  getSchedules: (req: AuthenticatedRequest, res: Response) => cleaningControllerInstance.getSchedules(req, res),
  createTask: (req: AuthenticatedRequest, res: Response) => cleaningControllerInstance.createTask(req, res),
  getTasks: (req: AuthenticatedRequest, res: Response) => cleaningControllerInstance.getTasks(req, res),
  getAssignmentsBySchedule: (req: AuthenticatedRequest, res: Response) => cleaningControllerInstance.getAssignmentsBySchedule(req, res),
  updateAssignmentStatus: (req: AuthenticatedRequest, res: Response) => cleaningControllerInstance.updateAssignmentStatus(req, res)
};
export { CleaningControllerWrapper as CleaningController };
