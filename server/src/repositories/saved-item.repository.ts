import { query, queryOne } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export class SavedItemRepository {
  async findByUserId(userId: string): Promise<any[]> {
    return query(
      `SELECT si.id, si.product_id, si.created_at,
              p.name, p.slug, p.price, p.currency, p.size, p.status, p.product_type,
              (SELECT url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, sort_order ASC LIMIT 1) as image_url
       FROM saved_items si
       JOIN products p ON si.product_id = p.id
       WHERE si.user_id = $1
       ORDER BY si.created_at DESC`,
      [userId]
    );
  }

  async isSaved(userId: string, productId: string): Promise<boolean> {
    const res = await queryOne('SELECT id FROM saved_items WHERE user_id = $1 AND product_id = $2', [userId, productId]);
    return !!res;
  }

  async toggleSave(userId: string, productId: string): Promise<{ saved: boolean }> {
    const existing = await queryOne<{ id: string }>('SELECT id FROM saved_items WHERE user_id = $1 AND product_id = $2', [userId, productId]);
    if (existing) {
      await query('DELETE FROM saved_items WHERE id = $1', [existing.id]);
      return { saved: false };
    } else {
      await query(
        'INSERT INTO saved_items (id, user_id, product_id) VALUES ($1, $2, $3)',
        [uuidv4(), userId, productId]
      );
      return { saved: true };
    }
  }
}

export class AnalyticsRepository {
  async track(eventType: string, payload: any = {}, sessionId?: string, userId?: string): Promise<void> {
    await query(
      'INSERT INTO analytics_events (id, event_type, payload, session_id, user_id) VALUES ($1, $2, $3, $4, $5)',
      [uuidv4(), eventType, JSON.stringify(payload), sessionId || null, userId || null]
    );
  }

  async getRecentEvents(limit = 50): Promise<any[]> {
    return query('SELECT * FROM analytics_events ORDER BY created_at DESC LIMIT $1', [limit]);
  }
}

export const savedItemRepository = new SavedItemRepository();
export const analyticsRepository = new AnalyticsRepository();
