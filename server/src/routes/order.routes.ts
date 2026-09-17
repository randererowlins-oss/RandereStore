import { Router } from 'express';
import { orderController } from '../controllers/order.controller.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/order.validator.js';
import { optionalAuth, requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// Create order - allows both guests and authenticated customers
router.post('/', optionalAuth, validateBody(createOrderSchema), orderController.create);

// Customer view their own orders
router.get('/my', requireAuth, orderController.getMyOrders);

// Order status lookup by orderNumber (public tracking with optional email verification)
router.get('/track/:orderNumber', orderController.getByOrderNumber);

// Get order by ID (with ownership verification)
router.get('/:id', optionalAuth, orderController.getById);

// Admin-only order list & status update
router.get('/', requireAuth, requireRole(['ADMIN']), orderController.listAll);
router.patch('/:id/status', requireAuth, requireRole(['ADMIN']), validateBody(updateOrderStatusSchema), orderController.updateStatus);

export default router;
