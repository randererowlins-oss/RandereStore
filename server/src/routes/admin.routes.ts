import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth, requireRole(['ADMIN']));

router.get('/metrics', adminController.getDashboardMetrics);
router.get('/customers', adminController.listCustomers);

export default router;
