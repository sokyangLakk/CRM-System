import { Router } from 'express';
import { AuthController } from '../Controllers/AuthController';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { teacherOrAdminMiddleware } from '../middlewares/AdminMiddleware';
import { DashboardController } from '../Controllers/DashboardController';
import { adminMiddleware } from '../middlewares/AdminMiddleware';
import { StudentController } from '../Controllers/StudentController';
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



export default router;

