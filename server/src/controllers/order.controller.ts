import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service.js';

export class OrderController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || null;
      const result = await orderService.createOrder({
        ...req.body,
        userId,
      });

      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderService.getOrderById(req.params.id, {
        userId: req.user?.userId,
        role: req.user?.role,
      });
      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByOrderNumber(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.query.email as string | undefined;
      const order = await orderService.getOrderByNumber(req.params.orderNumber, email);
      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyOrders(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      const orders = await orderService.getCustomerOrders(req.user.userId);
      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  async listAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await orderService.listAllOrders(req.query);
      res.status(200).json({
        success: true,
        data: result.orders,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await orderService.updateOrderStatus(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Order status updated',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const orderController = new OrderController();
