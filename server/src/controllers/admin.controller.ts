import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service.js';
import { userRepository } from '../repositories/user.repository.js';
import { analyticsRepository } from '../repositories/saved-item.repository.js';

export class AdminController {
  async getDashboardMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await orderService.getAdminStats();
      const customerCount = await userRepository.count();
      const recentActivity = await analyticsRepository.getRecentEvents(10);

      res.status(200).json({
        success: true,
        data: {
          ...stats,
          customerCount,
          recentActivity,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async listCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '20', 10);
      const offset = (page - 1) * limit;

      const customers = await userRepository.findAll(limit, offset);
      const total = await userRepository.count();

      res.status(200).json({
        success: true,
        data: customers,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
