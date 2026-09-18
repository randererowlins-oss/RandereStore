import { Router } from 'express';
import { transformationController } from '../controllers/transformation.controller.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { createTransformationSchema, updateTransformationSchema } from '../validators/transformation.validator.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', transformationController.list);
router.get('/:slug', transformationController.getBySlug);

// Admin-only
router.post('/', requireAuth, requireRole(['ADMIN']), validateBody(createTransformationSchema), transformationController.create);
router.patch('/:id', requireAuth, requireRole(['ADMIN']), validateBody(updateTransformationSchema), transformationController.update);
router.delete('/:id', requireAuth, requireRole(['ADMIN']), transformationController.delete);

export default router;
