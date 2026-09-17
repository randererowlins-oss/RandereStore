import { query, queryOne } from '../config/database.js';
import { UserRecord, UserRole } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';

export class UserRepository {
  async findById(id: string): Promise<UserRecord | null> {
    return queryOne<UserRecord>('SELECT * FROM users WHERE id = $1', [id]);
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    return queryOne<UserRecord>('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
  }

  async create(data: {
    email: string;
    passwordHash: string;
    fullName: string;
    phone?: string | null;
    role?: UserRole;
    avatarUrl?: string | null;
  }): Promise<UserRecord> {
    const id = uuidv4();
    const rows = await query<UserRecord>(
      `INSERT INTO users (id, email, password_hash, full_name, phone, role, avatar_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        id,
        data.email.toLowerCase(),
        data.passwordHash,
        data.fullName,
        data.phone || null,
        data.role || 'CUSTOMER',
        data.avatarUrl || null,
      ]
    );
    return rows[0];
  }

  async update(id: string, data: Partial<{
    fullName: string;
    phone: string | null;
    avatarUrl: string | null;
    role: UserRole;
  }>): Promise<UserRecord | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.fullName !== undefined) {
      fields.push(`full_name = $${idx++}`);
      values.push(data.fullName);
    }
    if (data.phone !== undefined) {
      fields.push(`phone = $${idx++}`);
      values.push(data.phone);
    }
    if (data.avatarUrl !== undefined) {
      fields.push(`avatar_url = $${idx++}`);
      values.push(data.avatarUrl);
    }
    if (data.role !== undefined) {
      fields.push(`role = $${idx++}`);
      values.push(data.role);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    return queryOne<UserRecord>(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
  }

  async count(): Promise<number> {
    const res = await queryOne<{ count: string }>('SELECT COUNT(*) as count FROM users');
    return parseInt(res?.count || '0', 10);
  }

  async findAll(limit = 50, offset = 0): Promise<UserRecord[]> {
    return query<UserRecord>(
      'SELECT id, email, full_name, phone, role, avatar_url, created_at, updated_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
  }
}

export const userRepository = new UserRepository();
