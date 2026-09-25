import { Router } from 'express';
import {
  applyToJob,
  getWorkerApplications,
  withdrawApplication,
  getJobApplications,
  updateApplicationStatus
} from '../controllers/application.controller.js';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Worker routes
router.post('/jobs/:jobId/apply', authenticateJWT, authorizeRoles('worker'), applyToJob);
router.get('/worker/my-applications', authenticateJWT, authorizeRoles('worker'), getWorkerApplications);
router.delete('/:id/withdraw', authenticateJWT, authorizeRoles('worker'), withdrawApplication);

// Employer routes
router.get('/jobs/:jobId', authenticateJWT, authorizeRoles('employer', 'admin'), getJobApplications);
router.patch('/:id/status', authenticateJWT, authorizeRoles('employer', 'admin'), updateApplicationStatus);

export default router;
