import { Router } from 'express';
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';
import orderRoutes from './order.routes.js';
import cartRoutes from './cart.routes.js';
import customRequestRoutes from './custom-request.routes.js';
import stylingRequestRoutes from './styling-request.routes.js';
import storyRoutes from './story.routes.js';
import transformationRoutes from './transformation.routes.js';
import adminRoutes from './admin.routes.js';
import savedItemRoutes from './saved-item.routes.js';
import analyticsRoutes from './analytics.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/custom-requests', customRequestRoutes);
router.use('/styling-requests', stylingRequestRoutes);
router.use('/stories', storyRoutes);
router.use('/transformations', transformationRoutes);
router.use('/admin', adminRoutes);
router.use('/saved', savedItemRoutes);
router.use('/', analyticsRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    brand: 'RANDERE',
    message: 'Circular Fashion & Creative Studio API Operational',
    timestamp: new Date().toISOString(),
  });
});

export default router;
