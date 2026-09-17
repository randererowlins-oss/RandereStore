import { Request, Response, NextFunction } from 'express';
import { cartService } from '../services/cart.service.js';

function getSessionId(req: Request): string {
  let sessionId = req.headers['x-session-id'] as string;
  if (!sessionId && req.cookies?.randere_session) {
    sessionId = req.cookies.randere_session;
  }
  return sessionId;
}

export class CartController {
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || null;
      const sessionId = getSessionId(req);
      const cart = await cartService.getCart(userId, sessionId);
      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || null;
      const sessionId = getSessionId(req);
      const { productId, quantity } = req.body;
      const cart = await cartService.addItem(userId, sessionId, productId, quantity || 1);
      res.status(200).json({
        success: true,
        message: 'Garment added to bag',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || null;
      const sessionId = getSessionId(req);
      const { productId, quantity } = req.body;
      const cart = await cartService.updateItemQuantity(userId, sessionId, productId, quantity);
      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || null;
      const sessionId = getSessionId(req);
      const { productId } = req.params;
      const cart = await cartService.removeItem(userId, sessionId, productId);
      res.status(200).json({
        success: true,
        message: 'Item removed from bag',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || null;
      const sessionId = getSessionId(req);
      const cart = await cartService.clearCart(userId, sessionId);
      res.status(200).json({
        success: true,
        message: 'Bag cleared',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const cartController = new CartController();
