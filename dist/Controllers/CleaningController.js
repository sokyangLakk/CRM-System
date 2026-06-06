import { BaseController } from './BaseController';
import { CleaningService } from '../Services/CleaningService';
class CleaningControllerImpl extends BaseController {
    static instance;
    constructor() {
        super();
    }
    static getInstance() {
        if (!CleaningControllerImpl.instance) {
            CleaningControllerImpl.instance = new CleaningControllerImpl();
        }
        return CleaningControllerImpl.instance;
    }
    async createSchedule(req, res) {
        const { date } = req.body;
        if (!date) {
            this.sendBadRequest(res, 'Date is required.');
            return;
        }
        try {
            const scheduleId = await CleaningService.createSchedule(req.body, req.user?.id, req.ip);
            this.sendSuccess(res, { scheduleId }, 'Cleaning schedule created successfully', 201);
        }
        catch (error) {
            this.sendError(res, error.message);
        }
    }
    async getSchedules(req, res) {
        try {
            const schedules = await CleaningService.getSchedules();
            this.sendSuccess(res, schedules);
        }
        catch (error) {
            this.sendError(res, error.message);
        }
    }
    async createTask(req, res) {
        const { task_name } = req.body;
        if (!task_name) {
            this.sendBadRequest(res, 'Task name is required.');
            return;
        }
        try {
            const taskId = await CleaningService.createTask(req.body);
            this.sendSuccess(res, { taskId }, 'Cleaning task created successfully', 201);
        }
        catch (error) {
            this.sendError(res, error.message);
        }
    }
    async getTasks(req, res) {
        try {
            const tasks = await CleaningService.getTasks();
            this.sendSuccess(res, tasks);
        }
        catch (error) {
            this.sendError(res, error.message);
        }
    }
    async getAssignmentsBySchedule(req, res) {
        const scheduleId = parseInt(req.params.scheduleId);
        try {
            const assignments = await CleaningService.getAssignmentsBySchedule(scheduleId);
            this.sendSuccess(res, assignments);
        }
        catch (error) {
            this.sendError(res, error.message);
        }
    }
    async updateAssignmentStatus(req, res) {
        const assignmentId = parseInt(req.params.assignmentId);
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
        }
        catch (error) {
            this.sendError(res, error.message);
        }
    }
}
const cleaningControllerInstance = CleaningControllerImpl.getInstance();
export const CleaningControllerWrapper = {
    createSchedule: (req, res) => cleaningControllerInstance.createSchedule(req, res),
    getSchedules: (req, res) => cleaningControllerInstance.getSchedules(req, res),
    createTask: (req, res) => cleaningControllerInstance.createTask(req, res),
    getTasks: (req, res) => cleaningControllerInstance.getTasks(req, res),
    getAssignmentsBySchedule: (req, res) => cleaningControllerInstance.getAssignmentsBySchedule(req, res),
    updateAssignmentStatus: (req, res) => cleaningControllerInstance.updateAssignmentStatus(req, res)
};
export { CleaningControllerWrapper as CleaningController };
