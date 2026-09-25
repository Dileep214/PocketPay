import { Router } from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  updateJobStatus,
  deleteJob,
  getEmployerJobs
} from '../controllers/job.controller.js';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware.js';
import { apiLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = Router();

// Public routes
router.get('/', apiLimiter, getJobs);
router.get('/:id', apiLimiter, getJobById);

// Protected routes (Employer / Admin)
router.post('/', authenticateJWT, authorizeRoles('employer', 'admin'), createJob);
router.get('/employer/my-jobs', authenticateJWT, authorizeRoles('employer'), getEmployerJobs);
router.put('/:id', authenticateJWT, authorizeRoles('employer', 'admin'), updateJob);
router.patch('/:id/status', authenticateJWT, authorizeRoles('employer', 'admin'), updateJobStatus);
router.delete('/:id', authenticateJWT, authorizeRoles('employer', 'admin'), deleteJob);

export default router;
