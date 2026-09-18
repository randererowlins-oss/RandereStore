import { Router } from 'express';
import { savedItemController } from '../controllers/saved-item.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', requireAuth, savedItemController.getSavedItems);
router.post('/toggle', requireAuth, savedItemController.toggleSave);

export default router;
