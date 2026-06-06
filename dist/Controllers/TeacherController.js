import { BaseController } from './BaseController';
import { TeacherService } from '../Services/TeacherService';
class TeacherControllerImpl extends BaseController {
    static instance;
    constructor() {
        super();
    }
    static getInstance() {
        if (!TeacherControllerImpl.instance) {
            TeacherControllerImpl.instance = new TeacherControllerImpl();
        }
        return TeacherControllerImpl.instance;
    }
    async getTeachers(req, res) {
        try {
            const teachers = await TeacherService.getAllTeachers();
            this.sendSuccess(res, teachers);
        }
        catch (error) {
            this.sendError(res, error.message);
        }
    }
    async getTeacherById(req, res) {
        const id = parseInt(req.params.id);
        try {
            const teacher = await TeacherService.getTeacherById(id);
            if (!teacher) {
                this.sendNotFound(res, 'Teacher not found');
                return;
            }
            this.sendSuccess(res, teacher);
        }
        catch (error) {
            this.sendError(res, error.message);
        }
    }
    async updateTeacher(req, res) {
        const id = parseInt(req.params.id);
        try {
            await TeacherService.updateTeacher(id, req.body, req.user?.id, req.ip);
            this.sendSuccess(res, null, 'Teacher profile updated successfully');
        }
        catch (error) {
            this.sendError(res, error.message, 400);
        }
    }
    async deleteTeacher(req, res) {
        const id = parseInt(req.params.id);
        try {
            await TeacherService.deleteTeacher(id, req.user?.id, req.ip);
            this.sendSuccess(res, null, 'Teacher deleted successfully');
        }
        catch (error) {
            this.sendError(res, error.message, 400);
        }
    }
}
const teacherControllerInstance = TeacherControllerImpl.getInstance();
export const TeacherControllerWrapper = {
    getTeachers: (req, res) => teacherControllerInstance.getTeachers(req, res),
    getTeacherById: (req, res) => teacherControllerInstance.getTeacherById(req, res),
    updateTeacher: (req, res) => teacherControllerInstance.updateTeacher(req, res),
    deleteTeacher: (req, res) => teacherControllerInstance.deleteTeacher(req, res)
};
export { TeacherControllerWrapper as TeacherController };
