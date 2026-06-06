import { Router } from 'express';
import { AuthController } from '../Controllers/AuthController';
import { CleaningController } from '../Controllers/CleaningController';
import { StudentController } from '../Controllers/StudentController';
import { TeacherController } from '../Controllers/TeacherController';
import { PunishmentController } from '../Controllers/PunishmentController';
import { DashboardController } from '../Controllers/DashboardController';
import { ClassController } from '../Controllers/ClassController';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { adminMiddleware, teacherOrAdminMiddleware } from '../middlewares/AdminMiddleware';
const router = Router();
// --- Auth Routes ---
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
// --- Dashboard & Reports Routes ---
router.get('/dashboard/stats', authMiddleware, teacherOrAdminMiddleware, DashboardController.getSummaryStats);
router.get('/dashboard/class/:classId', authMiddleware, teacherOrAdminMiddleware, DashboardController.getClassPerformanceReport);
router.get('/dashboard/logs', authMiddleware, adminMiddleware, DashboardController.getActivityLogs);
// --- Students Routes ---
router.get('/students', authMiddleware, teacherOrAdminMiddleware, StudentController.getStudents);
router.get('/students/:id', authMiddleware, StudentController.getStudentProfile);
router.put('/students/:id', authMiddleware, adminMiddleware, StudentController.updateStudent);
router.delete('/students/:id', authMiddleware, adminMiddleware, StudentController.deleteStudent);
// --- Teachers Routes ---
router.get('/teachers', authMiddleware, adminMiddleware, TeacherController.getTeachers);
router.get('/teachers/:id', authMiddleware, TeacherController.getTeacherById);
router.put('/teachers/:id', authMiddleware, adminMiddleware, TeacherController.updateTeacher);
router.delete('/teachers/:id', authMiddleware, adminMiddleware, TeacherController.deleteTeacher);
// --- Cleaning Schedule & Task Routes ---
router.post('/cleaning/schedules', authMiddleware, teacherOrAdminMiddleware, CleaningController.createSchedule);
router.get('/cleaning/schedules', authMiddleware, CleaningController.getSchedules);
router.get('/cleaning/schedules/:scheduleId/assignments', authMiddleware, CleaningController.getAssignmentsBySchedule);
router.post('/cleaning/tasks', authMiddleware, teacherOrAdminMiddleware, CleaningController.createTask);
router.get('/cleaning/tasks', authMiddleware, CleaningController.getTasks);
router.put('/cleaning/assignments/:assignmentId', authMiddleware, CleaningController.updateAssignmentStatus);
// --- Disciplinary Punishment Routes ---
router.post('/punishments', authMiddleware, teacherOrAdminMiddleware, PunishmentController.issuePunishment);
router.get('/punishments', authMiddleware, teacherOrAdminMiddleware, PunishmentController.getPunishments);
router.put('/punishments/:id', authMiddleware, teacherOrAdminMiddleware, PunishmentController.resolvePunishment);
// --- Classes Routes ---
router.post('/classes', authMiddleware, adminMiddleware, ClassController.createClass);
router.get('/classes', authMiddleware, ClassController.getClasses);
router.get('/classes/:id', authMiddleware, ClassController.getClassById);
router.put('/classes/:id', authMiddleware, adminMiddleware, ClassController.updateClass);
router.delete('/classes/:id', authMiddleware, adminMiddleware, ClassController.deleteClass);
export default router;
