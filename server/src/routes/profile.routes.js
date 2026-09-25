import { Router } from 'express';
import {
  getWorkerProfile,
  updateWorkerProfile,
  getEmployerProfile,
  updateEmployerProfile
} from '../controllers/profile.controller.js';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Worker Profile
router.get('/worker/me', authenticateJWT, authorizeRoles('worker'), getWorkerProfile);
router.put('/worker/me', authenticateJWT, authorizeRoles('worker'), updateWorkerProfile);

// Employer Profile
router.get('/employer/me', authenticateJWT, authorizeRoles('employer'), getEmployerProfile);
router.put('/employer/me', authenticateJWT, authorizeRoles('employer'), updateEmployerProfile);

export default router;
