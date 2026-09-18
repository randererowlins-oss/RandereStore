import { Router } from 'express';
import { productController } from '../controllers/product.controller.js';
import { validateBody, validateQuery } from '../middleware/validate.middleware.js';
import { createProductSchema, updateProductSchema, productQuerySchema } from '../validators/product.validator.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', validateQuery(productQuerySchema), productController.list);
router.get('/featured', productController.getFeaturedDrop);
router.get('/categories', productController.getCategories);
router.get('/:slug', productController.getBySlug);
router.get('/id/:id', productController.getById);

// Admin-only endpoints
router.post('/', requireAuth, requireRole(['ADMIN']), validateBody(createProductSchema), productController.create);
router.patch('/:id', requireAuth, requireRole(['ADMIN']), validateBody(updateProductSchema), productController.update);
router.delete('/:id', requireAuth, requireRole(['ADMIN']), productController.delete);

export default router;
