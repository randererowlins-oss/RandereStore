import { Request, Response, NextFunction } from 'express';
import { savedItemRepository, analyticsRepository } from '../repositories/saved-item.repository.js';
import { LocalStorageProvider } from '../services/storage/local-storage.provider.js';
import { BadRequestError } from '../utils/errors.js';

const storageProvider = new LocalStorageProvider();

export class SavedItemController {
  async getSavedItems(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      const items = await savedItemRepository.findByUserId(req.user.userId);
      res.status(200).json({
        success: true,
        data: items,
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleSave(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      const { productId } = req.body;
      if (!productId) {
        return res.status(400).json({ success: false, message: 'Product ID required' });
      }
      const result = await savedItemRepository.toggleSave(req.user.userId, productId);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export class AnalyticsController {
  async track(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventType, payload } = req.body;
      const sessionId = req.headers['x-session-id'] as string;
      const userId = req.user?.userId;

      await analyticsRepository.track(eventType || 'unknown', payload, sessionId, userId);
      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  }
}

export class UploadController {
  async uploadBase64(req: Request, res: Response, next: NextFunction) {
    try {
      const { image, fileName, mimeType } = req.body;
      if (!image) {
        throw new BadRequestError('Base64 image data is required');
      }

      // Handle data url prefix
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let buffer: Buffer;
      let detectedMime = mimeType || 'image/jpeg';

      if (matches && matches.length === 3) {
        detectedMime = matches[1];
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        buffer = Buffer.from(image, 'base64');
      }

      const result = await storageProvider.uploadFile(buffer, fileName || 'upload.jpg', detectedMime);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const savedItemController = new SavedItemController();
export const analyticsController = new AnalyticsController();
export const uploadController = new UploadController();
