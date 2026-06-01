import { Router } from 'express';
import { AuthController } from '../Controllers/AuthController';
const router = Router();

// --- Auth Routes ---
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

export default router;
