import { query, queryOne } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export interface CartWithItems {
  id: string;
  userId: string | null;
  sessionId: string | null;
  items: Array<{
    id: string;
    productId: string;
    name: string;
    slug: string;
    price: number;
    currency: string;
    size: string;
    oneOfOne: boolean;
    stockQuantity: number;
    status: string;
    quantity: number;
    imageUrl: string | null;
  }>;
}

export class CartRepository {
  async getOrCreateCart(userId?: string | null, sessionId?: string | null): Promise<string> {
    if (userId) {
      const existing = await queryOne<{ id: string }>('SELECT id FROM carts WHERE user_id = $1', [userId]);
      if (existing) return existing.id;
    } else if (sessionId) {
      const existing = await queryOne<{ id: string }>('SELECT id FROM carts WHERE session_id = $1', [sessionId]);
      if (existing) return existing.id;
    }

    const id = uuidv4();
    await query(
      'INSERT INTO carts (id, user_id, session_id) VALUES ($1, $2, $3)',
      [id, userId || null, sessionId || null]
    );
    return id;
  }

  async getCart(cartId: string): Promise<CartWithItems | null> {
    const cart = await queryOne<{ id: string; user_id: string | null; session_id: string | null }>(
      'SELECT * FROM carts WHERE id = $1',
      [cartId]
    );
    if (!cart) return null;

    const items = await query<any>(
      `SELECT ci.id, ci.product_id as "productId", ci.quantity,
              p.name, p.slug, p.price, p.currency, p.size, p.one_of_one as "oneOfOne",
              p.stock_quantity as "stockQuantity", p.status,
              (SELECT url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, sort_order ASC LIMIT 1) as "imageUrl"
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1
       ORDER BY ci.created_at ASC`,
      [cartId]
    );

    return {
      id: cart.id,
      userId: cart.user_id,
      sessionId: cart.session_id,
      items: items.map((i) => ({
        ...i,
        price: parseFloat(i.price),
      })),
    };
  }

  async addItem(cartId: string, productId: string, quantity = 1): Promise<void> {
    const existing = await queryOne<{ id: string; quantity: number }>(
      'SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2',
      [cartId, productId]
    );

    if (existing) {
      await query(
        'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [existing.quantity + quantity, existing.id]
      );
    } else {
      await query(
        'INSERT INTO cart_items (id, cart_id, product_id, quantity) VALUES ($1, $2, $3, $4)',
        [uuidv4(), cartId, productId, quantity]
      );
    }
  }

  async updateItemQuantity(cartId: string, productId: string, quantity: number): Promise<void> {
    if (quantity <= 0) {
      await this.removeItem(cartId, productId);
    } else {
      await query(
        'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE cart_id = $2 AND product_id = $3',
        [quantity, cartId, productId]
      );
    }
  }

  async removeItem(cartId: string, productId: string): Promise<void> {
    await query('DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2', [cartId, productId]);
  }

  async clearCart(cartId: string): Promise<void> {
    await query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
  }
}

export const cartRepository = new CartRepository();
