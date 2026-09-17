import { cartRepository } from '../repositories/cart.repository.js';
import { productRepository } from '../repositories/product.repository.js';
import { config } from '../config/env.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';

export class CartService {
  async getCart(userId?: string | null, sessionId?: string | null) {
    const cartId = await cartRepository.getOrCreateCart(userId, sessionId);
    const cart = await cartRepository.getCart(cartId);

    if (!cart) {
      return {
        id: cartId,
        items: [],
        subtotal: 0,
        shippingFee: config.shippingBaseFee,
        total: config.shippingBaseFee,
        currency: 'KES',
        itemCount: 0,
      };
    }

    let subtotal = 0;
    let itemCount = 0;

    for (const item of cart.items) {
      if (item.status === 'PUBLISHED' && item.stockQuantity > 0) {
        subtotal += item.price * item.quantity;
        itemCount += item.quantity;
      }
    }

    const shippingFee = subtotal >= config.freeShippingThreshold || subtotal === 0 ? 0 : config.shippingBaseFee;
    const total = subtotal + shippingFee;

    return {
      ...cart,
      subtotal,
      shippingFee,
      total,
      currency: 'KES',
      itemCount,
    };
  }

  async addItem(userId: string | null | undefined, sessionId: string | null | undefined, productId: string, quantity = 1) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (product.status !== 'PUBLISHED' || product.stock_quantity <= 0) {
      throw new BadRequestError('This garment is no longer available');
    }

    if (product.one_of_one && quantity > 1) {
      quantity = 1;
    }

    const cartId = await cartRepository.getOrCreateCart(userId, sessionId);
    await cartRepository.addItem(cartId, productId, quantity);

    return this.getCart(userId, sessionId);
  }

  async updateItemQuantity(userId: string | null | undefined, sessionId: string | null | undefined, productId: string, quantity: number) {
    const product = await productRepository.findById(productId);
    if (product && product.one_of_one && quantity > 1) {
      quantity = 1;
    }

    const cartId = await cartRepository.getOrCreateCart(userId, sessionId);
    await cartRepository.updateItemQuantity(cartId, productId, quantity);

    return this.getCart(userId, sessionId);
  }

  async removeItem(userId: string | null | undefined, sessionId: string | null | undefined, productId: string) {
    const cartId = await cartRepository.getOrCreateCart(userId, sessionId);
    await cartRepository.removeItem(cartId, productId);

    return this.getCart(userId, sessionId);
  }

  async clearCart(userId: string | null | undefined, sessionId: string | null | undefined) {
    const cartId = await cartRepository.getOrCreateCart(userId, sessionId);
    await cartRepository.clearCart(cartId);

    return this.getCart(userId, sessionId);
  }
}

export const cartService = new CartService();
