import { BaseController } from './BaseController';
import { ClassService } from '../Services/ClassService';
class ClassControllerImpl extends BaseController {
    static instance;
    constructor() {
        super();
    }
    static getInstance() {
        if (!ClassControllerImpl.instance) {
            ClassControllerImpl.instance = new ClassControllerImpl();
        }
        return ClassControllerImpl.instance;
    }
    async createClass(req, res) {
        const { class_name } = req.body;
        if (!class_name) {
            this.sendBadRequest(res, 'Class name is required');
            return;
        }
        try {
            const classId = await ClassService.createClass(req.body, req.user?.id, req.ip);
            this.sendSuccess(res, { classId }, 'Class created successfully', 201);
        }
        catch (error) {
            this.sendError(res, error.message);
        }
    }
    async getClasses(req, res) {
        try {
            const classes = await ClassService.getAllClasses();
            this.sendSuccess(res, classes);
        }
        catch (error) {
            this.sendError(res, error.message);
        }
    }
    async getClassById(req, res) {
        const id = parseInt(req.params.id);
        try {
            const cls = await ClassService.getClassById(id);
            if (!cls) {
                this.sendNotFound(res, 'Class not found');
                return;
            }
            this.sendSuccess(res, cls);
        }
        catch (error) {
            this.sendError(res, error.message);
        }
    }
    async updateClass(req, res) {
        const id = parseInt(req.params.id);
        try {
            await ClassService.updateClass(id, req.body, req.user?.id, req.ip);
            this.sendSuccess(res, null, 'Class updated successfully');
        }
        catch (error) {
            this.sendError(res, error.message, 400);
        }
    }
    async deleteClass(req, res) {
        const id = parseInt(req.params.id);
        try {
            await ClassService.deleteClass(id, req.user?.id, req.ip);
            this.sendSuccess(res, null, 'Class deleted successfully');
        }
        catch (error) {
            this.sendError(res, error.message, 400);
        }
    }
}
const classControllerInstance = ClassControllerImpl.getInstance();
export const ClassControllerWrapper = {
    createClass: (req, res) => classControllerInstance.createClass(req, res),
    getClasses: (req, res) => classControllerInstance.getClasses(req, res),
    getClassById: (req, res) => classControllerInstance.getClassById(req, res),
    updateClass: (req, res) => classControllerInstance.updateClass(req, res),
    deleteClass: (req, res) => classControllerInstance.deleteClass(req, res)
};
export { ClassControllerWrapper as ClassController };
