import { query, queryOne } from '../config/database.js';
import { StoryRecord } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';

export class StoryRepository {
  async findById(id: string): Promise<StoryRecord | null> {
    return queryOne<StoryRecord>('SELECT * FROM stories WHERE id = $1', [id]);
  }

  async findBySlug(slug: string): Promise<StoryRecord | null> {
    return queryOne<StoryRecord>('SELECT * FROM stories WHERE slug = $1', [slug]);
  }

  async findAll(params: {
    tag?: string;
    contentType?: string;
    publishedOnly?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ stories: StoryRecord[]; total: number; page: number; limit: number; totalPages: number }> {
    const conditions: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (params.publishedOnly !== false) {
      conditions.push(`published = TRUE`);
    }

    if (params.contentType && params.contentType !== 'ALL') {
      conditions.push(`content_type = $${idx++}`);
      values.push(params.contentType);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const countRes = await queryOne<{ count: string }>(`SELECT COUNT(*) as count FROM stories ${where}`, values);
    const total = parseInt(countRes?.count || '0', 10);

    const page = params.page || 1;
    const limit = params.limit || 12;
    const offset = (page - 1) * limit;

    const stories = await query<StoryRecord>(
      `SELECT * FROM stories ${where} ORDER BY published_at DESC, created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
      [...values, limit, offset]
    );

    return {
      stories,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async create(data: {
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    coverImage: string;
    author?: string;
    tags?: string[];
    contentType?: string;
    published?: boolean;
    readTimeMinutes?: number;
  }): Promise<StoryRecord> {
    const id = uuidv4();
    const rows = await query<StoryRecord>(
      `INSERT INTO stories (
        id, title, slug, excerpt, body, cover_image, author,
        tags, content_type, published, read_time_minutes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        id,
        data.title,
        data.slug,
        data.excerpt,
        data.body,
        data.coverImage,
        data.author || 'RANDERE Studio',
        JSON.stringify(data.tags || []),
        data.contentType || 'story',
        data.published !== undefined ? data.published : true,
        data.readTimeMinutes || 3,
      ]
    );
    return rows[0];
  }

  async update(id: string, data: Partial<{
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    coverImage: string;
    author: string;
    tags: string[];
    contentType: string;
    published: boolean;
    readTimeMinutes: number;
  }>): Promise<StoryRecord | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    const setField = (col: string, val: any) => {
      fields.push(`${col} = $${idx++}`);
      values.push(val);
    };

    if (data.title !== undefined) setField('title', data.title);
    if (data.slug !== undefined) setField('slug', data.slug);
    if (data.excerpt !== undefined) setField('excerpt', data.excerpt);
    if (data.body !== undefined) setField('body', data.body);
    if (data.coverImage !== undefined) setField('cover_image', data.coverImage);
    if (data.author !== undefined) setField('author', data.author);
    if (data.tags !== undefined) setField('tags', JSON.stringify(data.tags));
    if (data.contentType !== undefined) setField('content_type', data.contentType);
    if (data.published !== undefined) setField('published', data.published);
    if (data.readTimeMinutes !== undefined) setField('read_time_minutes', data.readTimeMinutes);

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    return queryOne<StoryRecord>(
      `UPDATE stories SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
  }

  async delete(id: string): Promise<boolean> {
    const res = await query('DELETE FROM stories WHERE id = $1 RETURNING id', [id]);
    return res.length > 0;
  }
}

export const storyRepository = new StoryRepository();
