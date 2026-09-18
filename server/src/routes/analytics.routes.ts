import { Router } from 'express';
import { analyticsController, uploadController } from '../controllers/saved-item.controller.js';
import { optionalAuth, requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/events', optionalAuth, analyticsController.track);
router.post('/upload', requireAuth, uploadController.uploadBase64);

export default router;
