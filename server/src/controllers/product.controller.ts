import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service.js';

export class ProductController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.listProducts(req.query);
      res.status(200).json({
        success: true,
        data: result.products,
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

  async getFeaturedDrop(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.getFeaturedDrop();
      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductBySlug(req.params.slug);
      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductById(req.params.id);
      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await productService.getCategories();
      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json({
        success: true,
        message: 'Garment added to collection',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Product updated',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await productService.deleteProduct(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Product deleted',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
