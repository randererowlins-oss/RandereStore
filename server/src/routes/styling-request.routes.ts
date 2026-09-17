import { Router } from 'express';
import { stylingRequestController } from '../controllers/styling-request.controller.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { createStylingRequestSchema, updateStylingRequestStatusSchema } from '../validators/styling-request.validator.js';
import { optionalAuth, requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', optionalAuth, validateBody(createStylingRequestSchema), stylingRequestController.submit);
router.get('/my', requireAuth, stylingRequestController.getMyRequests);
router.get('/:id', optionalAuth, stylingRequestController.getById);

// Admin-only
router.get('/', requireAuth, requireRole(['ADMIN']), stylingRequestController.listAll);
router.patch('/:id/status', requireAuth, requireRole(['ADMIN']), validateBody(updateStylingRequestStatusSchema), stylingRequestController.updateStatus);

export default router;
