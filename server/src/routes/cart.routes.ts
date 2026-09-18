import { Router } from 'express';
import { cartController } from '../controllers/cart.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(optionalAuth);

router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.patch('/items', cartController.updateItem);
router.delete('/items/:productId', cartController.removeItem);
router.delete('/', cartController.clearCart);

export default router;
