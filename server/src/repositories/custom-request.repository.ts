import { query, queryOne } from '../config/database.js';
import { CustomRequestRecord, CustomRequestStatus } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';

export class CustomRequestRepository {
  async findById(id: string): Promise<CustomRequestRecord | null> {
    return queryOne<CustomRequestRecord>('SELECT * FROM custom_requests WHERE id = $1', [id]);
  }

  async findByUserId(userId: string): Promise<CustomRequestRecord[]> {
    return query<CustomRequestRecord>(
      'SELECT * FROM custom_requests WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
  }

  async findAll(params: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ requests: CustomRequestRecord[]; total: number; page: number; limit: number; totalPages: number }> {
    const conditions: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (params.status) {
      conditions.push(`status = $${idx++}`);
      values.push(params.status);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const countRes = await queryOne<{ count: string }>(`SELECT COUNT(*) as count FROM custom_requests ${where}`, values);
    const total = parseInt(countRes?.count || '0', 10);

    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;

    const requests = await query<CustomRequestRecord>(
      `SELECT * FROM custom_requests ${where} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
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
    garmentType: string;
    serviceTypes: string[];
    budget?: number | null;
    deadline?: string | null;
    description: string;
    garmentPhotos?: string[];
    inspirationPhotos?: string[];
  }): Promise<CustomRequestRecord> {
    const id = uuidv4();
    const rows = await query<CustomRequestRecord>(
      `INSERT INTO custom_requests (
        id, user_id, customer_name, customer_email, customer_phone,
        garment_type, service_types, budget, deadline, description,
        garment_photos, inspiration_photos, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'SUBMITTED')
      RETURNING *`,
      [
        id,
        data.userId || null,
        data.customerName,
        data.customerEmail,
        data.customerPhone,
        data.garmentType,
        JSON.stringify(data.serviceTypes),
        data.budget || null,
        data.deadline || null,
        data.description,
        JSON.stringify(data.garmentPhotos || []),
        JSON.stringify(data.inspirationPhotos || []),
      ]
    );
    return rows[0];
  }

  async updateStatus(id: string, updates: {
    status: CustomRequestStatus;
    quoteAmount?: number | null;
    adminNotes?: string | null;
  }): Promise<CustomRequestRecord | null> {
    const fields: string[] = ['status = $1', 'updated_at = CURRENT_TIMESTAMP'];
    const values: any[] = [updates.status];
    let idx = 2;

    if (updates.quoteAmount !== undefined) {
      fields.push(`quote_amount = $${idx++}`);
      values.push(updates.quoteAmount);
    }
    if (updates.adminNotes !== undefined) {
      fields.push(`admin_notes = $${idx++}`);
      values.push(updates.adminNotes);
    }

    values.push(id);
    return queryOne<CustomRequestRecord>(
      `UPDATE custom_requests SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
  }
}

export const customRequestRepository = new CustomRequestRepository();
