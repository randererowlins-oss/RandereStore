import { Request, Response, NextFunction } from 'express';
import { customRequestService } from '../services/custom-request.service.js';

export class CustomRequestController {
  async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || null;
      const request = await customRequestService.submitRequest({
        ...req.body,
        userId,
      });

      res.status(201).json({
        success: true,
        message: 'Your custom transformation request has been received. Our studio will review it.',
        data: request,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyRequests(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      const requests = await customRequestService.getUserRequests(req.user.userId);
      res.status(200).json({
        success: true,
        data: requests,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const request = await customRequestService.getRequestById(req.params.id);
      res.status(200).json({
        success: true,
        data: request,
      });
    } catch (error) {
      next(error);
    }
  }

  async listAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await customRequestService.listRequests(req.query);
      res.status(200).json({
        success: true,
        data: result.requests,
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
      const updated = await customRequestService.updateRequestStatus(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Custom request updated',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const customRequestController = new CustomRequestController();
