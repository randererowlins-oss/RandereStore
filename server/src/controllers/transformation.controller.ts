import { Request, Response, NextFunction } from 'express';
import { transformationService } from '../services/transformation.service.js';

export class TransformationController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await transformationService.listTransformations(req.query.all !== 'true');
      res.status(200).json({
        success: true,
        data: items,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await transformationService.getTransformationBySlug(req.params.slug);
      res.status(200).json({
        success: true,
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await transformationService.createTransformation(req.body);
      res.status(201).json({
        success: true,
        message: 'Transformation recorded',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await transformationService.updateTransformation(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Transformation updated',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await transformationService.deleteTransformation(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Transformation deleted',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const transformationController = new TransformationController();
