import { Router } from 'express';
import { AuthController } from '../Controllers/AuthController';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { DashboardController } from '../Controllers/DashboardController';
import { StudentController } from '../Controllers/StudentController';
import { CleaningController } from '../Controllers/CleaningController';
import { TeacherController } from '../Controllers/TeacherController';
import { adminMiddleware, teacherOrAdminMiddleware } from '../middlewares/AdminMiddleware';
const router = Router();

// --- Auth Routes ---
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

// --- Dashboard & Reports Routes ---
router.get('/dashboard/stats', authMiddleware as any, teacherOrAdminMiddleware as any, DashboardController.getSummaryStats as any);
router.get('/dashboard/class/:classId', authMiddleware as any, teacherOrAdminMiddleware as any, DashboardController.getClassPerformanceReport as any);
router.get('/dashboard/logs', authMiddleware as any, adminMiddleware as any, DashboardController.getActivityLogs as any);

// --- Students Routes ---
router.get('/students', authMiddleware as any, teacherOrAdminMiddleware as any, StudentController.getStudents as any);
router.get('/students/:id', authMiddleware as any, StudentController.getStudentProfile as any);
router.put('/students/:id', authMiddleware as any, adminMiddleware as any, StudentController.updateStudent as any);
router.delete('/students/:id', authMiddleware as any, adminMiddleware as any, StudentController.deleteStudent as any);

// --- Teachers Routes ---
router.get('/teachers', authMiddleware as any, adminMiddleware as any, TeacherController.getTeachers as any);
router.get('/teachers/:id', authMiddleware as any, TeacherController.getTeacherById as any);
router.put('/teachers/:id', authMiddleware as any, adminMiddleware as any, TeacherController.updateTeacher as any);
router.delete('/teachers/:id', authMiddleware as any, adminMiddleware as any, TeacherController.deleteTeacher as any);

// --- Cleaning Schedule & Task Routes ---
router.post('/cleaning/schedules', authMiddleware as any, teacherOrAdminMiddleware as any, CleaningController.createSchedule as any);
router.get('/cleaning/schedules', authMiddleware as any, CleaningController.getSchedules as any);
router.get('/cleaning/schedules/:scheduleId/assignments', authMiddleware as any, CleaningController.getAssignmentsBySchedule as any);

router.post('/cleaning/tasks', authMiddleware as any, teacherOrAdminMiddleware as any, CleaningController.createTask as any);
router.get('/cleaning/tasks', authMiddleware as any, CleaningController.getTasks as any);

router.put('/cleaning/assignments/:assignmentId', authMiddleware as any, CleaningController.updateAssignmentStatus as any);




export default router;
