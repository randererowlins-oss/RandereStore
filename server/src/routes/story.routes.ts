import { Router } from 'express';
import { storyController } from '../controllers/story.controller.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { createStorySchema, updateStorySchema } from '../validators/story.validator.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', storyController.list);
router.get('/:slug', storyController.getBySlug);

// Admin-only
router.post('/', requireAuth, requireRole(['ADMIN']), validateBody(createStorySchema), storyController.create);
router.patch('/:id', requireAuth, requireRole(['ADMIN']), validateBody(updateStorySchema), storyController.update);
router.delete('/:id', requireAuth, requireRole(['ADMIN']), storyController.delete);

export default router;
