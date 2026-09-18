import { Router } from 'express';
import { customRequestController } from '../controllers/custom-request.controller.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { createCustomRequestSchema, updateCustomRequestStatusSchema } from '../validators/custom-request.validator.js';
import { optionalAuth, requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', optionalAuth, validateBody(createCustomRequestSchema), customRequestController.submit);
router.get('/my', requireAuth, customRequestController.getMyRequests);
router.get('/:id', optionalAuth, customRequestController.getById);

// Admin-only
router.get('/', requireAuth, requireRole(['ADMIN']), customRequestController.listAll);
router.patch('/:id/status', requireAuth, requireRole(['ADMIN']), validateBody(updateCustomRequestStatusSchema), customRequestController.updateStatus);

export default router;
