import { Request, Response, NextFunction } from 'express';
import { stylingRequestService } from '../services/styling-request.service.js';

export class StylingRequestController {
  async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || null;
      const request = await stylingRequestService.submitRequest({
        ...req.body,
        userId,
      });

      res.status(201).json({
        success: true,
        message: 'Your styling consultation brief has been plugged in. Our stylist team will contact you.',
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
      const requests = await stylingRequestService.getUserRequests(req.user.userId);
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
      const request = await stylingRequestService.getRequestById(req.params.id);
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
      const result = await stylingRequestService.listRequests(req.query);
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
      const updated = await stylingRequestService.updateRequestStatus(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Styling request updated',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const stylingRequestController = new StylingRequestController();
