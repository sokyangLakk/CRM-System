import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/AuthMiddleware';
import { BaseController } from './BaseController';
import { PunishmentService } from '../Services/PunishmentService';

class PunishmentControllerImpl extends BaseController {
  private static instance: PunishmentControllerImpl;

  private constructor() {
    super();
  }

  public static getInstance(): PunishmentControllerImpl {
    if (!PunishmentControllerImpl.instance) {
      PunishmentControllerImpl.instance = new PunishmentControllerImpl();
    }
    return PunishmentControllerImpl.instance;
  }

  public async issuePunishment(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { student_id, offense, punishment_type } = req.body;

    if (!student_id || !offense || !punishment_type) {
      this.sendBadRequest(res, 'Missing parameters: student_id, offense, or punishment_type');
      return;
    }

    try {
      const recordId = await PunishmentService.issuePunishmentService(req.body, req.user?.role, req.user?.id, req.ip);
      this.sendSuccess(res, { recordId }, 'Punishment recorded successfully', 201);
    } catch (error: any) {
      this.sendError(res, error.message);
    }
  }

  public async resolvePunishment(req: AuthenticatedRequest, res: Response): Promise<void> {
    const recordId = parseInt(req.params.id as string);
    const { status } = req.body; // 'completed' | 'appealed'

    if (!status || !['completed', 'appealed'].includes(status)) {
      this.sendBadRequest(res, 'Valid status is required ("completed", "appealed").');
      return;
    }

    try {
      const success = await PunishmentService.resolvePunishmentService(recordId, status, req.user?.id, req.ip);
      if (!success) {
        this.sendNotFound(res, 'Punishment record not found');
        return;
      }
      this.sendSuccess(res, null, 'Punishment record updated successfully');
    } catch (error: any) {
      this.sendError(res, error.message);
    }
  }

  public async getPunishments(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const records = await PunishmentService.getAllPunishments();
      this.sendSuccess(res, records);
    } catch (error: any) {
      this.sendError(res, error.message);
    }
  }
}

const punishmentControllerInstance = PunishmentControllerImpl.getInstance();
export const PunishmentControllerWrapper = {
  issuePunishment: (req: AuthenticatedRequest, res: Response) => punishmentControllerInstance.issuePunishment(req, res),
  resolvePunishment: (req: AuthenticatedRequest, res: Response) => punishmentControllerInstance.resolvePunishment(req, res),
  getPunishments: (req: AuthenticatedRequest, res: Response) => punishmentControllerInstance.getPunishments(req, res)
};
export { PunishmentControllerWrapper as PunishmentController };
