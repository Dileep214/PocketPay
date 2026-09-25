import { Router } from 'express';
import authRoutes from './auth.routes.js';
import jobRoutes from './job.routes.js';
import applicationRoutes from './application.routes.js';
import profileRoutes from './profile.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

router.get('/', (req, res) => {
	res.status(200).json({
		status: 'ok',
		message: 'WorkNear API v1 is running',
		endpoints: ['/auth', '/jobs', '/applications', '/profiles', '/admin']
	});
});

router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/profiles', profileRoutes);
router.use('/admin', adminRoutes);

export default router;
