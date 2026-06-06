import { BaseController } from './BaseController';
import { PunishmentService } from '../Services/PunishmentService';
class PunishmentControllerImpl extends BaseController {
    static instance;
    constructor() {
        super();
    }
    static getInstance() {
        if (!PunishmentControllerImpl.instance) {
            PunishmentControllerImpl.instance = new PunishmentControllerImpl();
        }
        return PunishmentControllerImpl.instance;
    }
    async issuePunishment(req, res) {
        const { student_id, offense, punishment_type } = req.body;
        if (!student_id || !offense || !punishment_type) {
            this.sendBadRequest(res, 'Missing parameters: student_id, offense, or punishment_type');
            return;
        }
        try {
            const recordId = await PunishmentService.issuePunishmentService(req.body, req.user?.role, req.user?.id, req.ip);
            this.sendSuccess(res, { recordId }, 'Punishment recorded successfully', 201);
        }
        catch (error) {
            this.sendError(res, error.message);
        }
    }
    async resolvePunishment(req, res) {
        const recordId = parseInt(req.params.id);
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
        }
        catch (error) {
            this.sendError(res, error.message);
        }
    }
    async getPunishments(req, res) {
        try {
            const records = await PunishmentService.getAllPunishments();
            this.sendSuccess(res, records);
        }
        catch (error) {
            this.sendError(res, error.message);
        }
    }
}
const punishmentControllerInstance = PunishmentControllerImpl.getInstance();
export const PunishmentControllerWrapper = {
    issuePunishment: (req, res) => punishmentControllerInstance.issuePunishment(req, res),
    resolvePunishment: (req, res) => punishmentControllerInstance.resolvePunishment(req, res),
    getPunishments: (req, res) => punishmentControllerInstance.getPunishments(req, res)
};
export { PunishmentControllerWrapper as PunishmentController };
