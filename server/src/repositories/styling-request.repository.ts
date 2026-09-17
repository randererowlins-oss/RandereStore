import { query, queryOne } from '../config/database.js';
import { StylingRequestRecord, StylingRequestStatus } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';

export class StylingRequestRepository {
  async findById(id: string): Promise<StylingRequestRecord | null> {
    return queryOne<StylingRequestRecord>('SELECT * FROM styling_requests WHERE id = $1', [id]);
  }

  async findByUserId(userId: string): Promise<StylingRequestRecord[]> {
    return query<StylingRequestRecord>(
      'SELECT * FROM styling_requests WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
  }

  async findAll(params: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ requests: StylingRequestRecord[]; total: number; page: number; limit: number; totalPages: number }> {
    const conditions: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (params.status) {
      conditions.push(`status = $${idx++}`);
      values.push(params.status);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const countRes = await queryOne<{ count: string }>(`SELECT COUNT(*) as count FROM styling_requests ${where}`, values);
    const total = parseInt(countRes?.count || '0', 10);

    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;

    const requests = await query<StylingRequestRecord>(
      `SELECT * FROM styling_requests ${where} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
      [...values, limit, offset]
    );

    return {
      requests,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async create(data: {
    userId?: string | null;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    occasion: string;
    eventDate?: string | null;
    budget?: number | null;
    preferredAesthetic: string;
    size: string;
    presentationPreference: string;
    colorPreferences?: string | null;
    referencePhotos?: string[];
    additionalNotes?: string | null;
  }): Promise<StylingRequestRecord> {
    const id = uuidv4();
    const rows = await query<StylingRequestRecord>(
      `INSERT INTO styling_requests (
        id, user_id, customer_name, customer_email, customer_phone,
        occasion, event_date, budget, preferred_aesthetic, size,
        presentation_preference, color_preferences, reference_photos,
        additional_notes, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'SUBMITTED')
      RETURNING *`,
      [
        id,
        data.userId || null,
        data.customerName,
        data.customerEmail,
        data.customerPhone,
        data.occasion,
        data.eventDate || null,
        data.budget || null,
        data.preferredAesthetic,
        data.size,
        data.presentationPreference,
        data.colorPreferences || null,
        JSON.stringify(data.referencePhotos || []),
        data.additionalNotes || null,
      ]
    );
    return rows[0];
  }

  async updateStatus(id: string, updates: {
    status: StylingRequestStatus;
    stylistNotes?: string | null;
  }): Promise<StylingRequestRecord | null> {
    const fields: string[] = ['status = $1', 'updated_at = CURRENT_TIMESTAMP'];
    const values: any[] = [updates.status];
    let idx = 2;

    if (updates.stylistNotes !== undefined) {
      fields.push(`stylist_notes = $${idx++}`);
      values.push(updates.stylistNotes);
    }

    values.push(id);
    return queryOne<StylingRequestRecord>(
      `UPDATE styling_requests SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
  }
}

export const stylingRequestRepository = new StylingRequestRepository();
