import { Router } from 'express';
import { getStats, moderateJob, moderateUser } from '../controllers/admin.controller.js';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateJWT, authorizeRoles('admin'));

router.get('/stats', getStats);
router.patch('/jobs/:id/moderate', moderateJob);
router.patch('/users/:id/status', moderateUser);

export default router;
