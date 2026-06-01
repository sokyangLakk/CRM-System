import { Router } from 'express';
import { AuthController } from '../Controllers/AuthController';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { CleaningController } from '../Controllers/CleaningController';
import { TeacherController } from '../Controllers/TeacherController';
import { adminMiddleware, teacherOrAdminMiddleware } from '../middlewares/AdminMiddleware';
const router = Router();

// --- Auth Routes ---
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);


// --- Teachers Routes ---
router.get('/teachers', authMiddleware as any, adminMiddleware as any, TeacherController.getTeachers as any);
router.get('/teachers/:id', authMiddleware as any, TeacherController.getTeacherById as any);
router.put('/teachers/:id', authMiddleware as any, adminMiddleware as any, TeacherController.updateTeacher as any);
router.delete('/teachers/:id', authMiddleware as any, adminMiddleware as any, TeacherController.deleteTeacher as any);
export default router;

// --- Cleaning Schedule & Task Routes ---
router.post('/cleaning/schedules', authMiddleware as any, teacherOrAdminMiddleware as any, CleaningController.createSchedule as any);
router.get('/cleaning/schedules', authMiddleware as any, CleaningController.getSchedules as any);
router.get('/cleaning/schedules/:scheduleId/assignments', authMiddleware as any, CleaningController.getAssignmentsBySchedule as any);

router.post('/cleaning/tasks', authMiddleware as any, teacherOrAdminMiddleware as any, CleaningController.createTask as any);
router.get('/cleaning/tasks', authMiddleware as any, CleaningController.getTasks as any);

router.put('/cleaning/assignments/:assignmentId', authMiddleware as any, CleaningController.updateAssignmentStatus as any);