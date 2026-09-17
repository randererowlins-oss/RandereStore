import { query, queryOne } from '../config/database.js';
import { ProductRecord, ProductImageRecord, CategoryRecord } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';

export class ProductRepository {
  async findCategories(): Promise<CategoryRecord[]> {
    return query<CategoryRecord>('SELECT * FROM categories ORDER BY sort_order ASC, name ASC');
  }

  async findCategoryBySlug(slug: string): Promise<CategoryRecord | null> {
    return queryOne<CategoryRecord>('SELECT * FROM categories WHERE slug = $1', [slug]);
  }

  async findCategoryById(id: string): Promise<CategoryRecord | null> {
    return queryOne<CategoryRecord>('SELECT * FROM categories WHERE id = $1', [id]);
  }

  async ensureCategory(name: string, slug: string, description?: string): Promise<CategoryRecord> {
    const existing = await this.findCategoryBySlug(slug);
    if (existing) return existing;

    const id = uuidv4();
    const rows = await query<CategoryRecord>(
      `INSERT INTO categories (id, name, slug, description) VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, name, slug, description || null]
    );
    return rows[0];
  }

  async findById(id: string): Promise<ProductRecord | null> {
    const product = await queryOne<ProductRecord>(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [id]
    );
    if (!product) return null;

    const images = await this.findProductImages(product.id);
    return { ...product, images };
  }

  async findBySlug(slug: string): Promise<ProductRecord | null> {
    const product = await queryOne<ProductRecord>(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = $1`,
      [slug]
    );
    if (!product) return null;

    const images = await this.findProductImages(product.id);
    return { ...product, images };
  }

  async findProductImages(productId: string): Promise<ProductImageRecord[]> {
    return query<ProductImageRecord>(
      `SELECT * FROM product_images WHERE product_id = $1 ORDER BY is_primary DESC, sort_order ASC, created_at ASC`,
      [productId]
    );
  }

  async incrementViewCount(id: string): Promise<void> {
    await query('UPDATE products SET view_count = view_count + 1 WHERE id = $1', [id]);
  }

  async findAll(params: {
    category?: string;
    type?: string;
    size?: string;
    minPrice?: number;
    maxPrice?: number;
    oneOfOne?: boolean;
    status?: string;
    condition?: string;
    search?: string;
    sort?: 'newest' | 'price-asc' | 'price-desc' | 'featured';
    page?: number;
    limit?: number;
  }): Promise<{ products: ProductRecord[]; total: number; page: number; limit: number; totalPages: number }> {
    const conditions: string[] = [];
    const values: any[] = [];
    let idx = 1;

    // Status filter - default to PUBLISHED unless admin requested
    if (params.status) {
      conditions.push(`p.status = $${idx++}`);
      values.push(params.status);
    } else {
      conditions.push(`p.status = 'PUBLISHED'`);
    }

    if (params.category && params.category !== 'all' && params.category !== 'ALL') {
      conditions.push(`(c.slug = $${idx} OR c.name ILIKE $${idx})`);
      values.push(params.category);
      idx++;
    }

    if (params.type && params.type !== 'ALL') {
      conditions.push(`p.product_type = $${idx++}`);
      values.push(params.type);
    }

    if (params.size) {
      conditions.push(`p.size ILIKE $${idx++}`);
      values.push(`%${params.size}%`);
    }

    if (params.minPrice !== undefined) {
      conditions.push(`p.price >= $${idx++}`);
      values.push(params.minPrice);
    }

    if (params.maxPrice !== undefined) {
      conditions.push(`p.price <= $${idx++}`);
      values.push(params.maxPrice);
    }

    if (params.oneOfOne !== undefined) {
      conditions.push(`p.one_of_one = $${idx++}`);
      values.push(params.oneOfOne);
    }

    if (params.condition) {
      conditions.push(`p.condition ILIKE $${idx++}`);
      values.push(`%${params.condition}%`);
    }

    if (params.search) {
      conditions.push(
        `(p.name ILIKE $${idx} OR p.description ILIKE $${idx} OR p.materials ILIKE $${idx} OR c.name ILIKE $${idx})`
      );
      values.push(`%${params.search}%`);
      idx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Total count query
    const countSql = `
      SELECT COUNT(*) as count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `;
    const countRes = await queryOne<{ count: string }>(countSql, values);
    const total = parseInt(countRes?.count || '0', 10);

    // Sorting
    let orderBy = 'p.published_at DESC NULLS LAST, p.created_at DESC';
    if (params.sort === 'price-asc') {
      orderBy = 'p.price ASC';
    } else if (params.sort === 'price-desc') {
      orderBy = 'p.price DESC';
    } else if (params.sort === 'featured') {
      orderBy = 'p.featured DESC, p.created_at DESC';
    }

    const page = params.page || 1;
    const limit = params.limit || 24;
    const offset = (page - 1) * limit;

    const dataSql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${idx++} OFFSET $${idx++}
    `;

    const products = await query<ProductRecord>(dataSql, [...values, limit, offset]);

    // Attach images
    for (const p of products) {
      p.images = await this.findProductImages(p.id);
    }

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async create(data: {
    name: string;
    slug: string;
    description: string;
    categoryId: string;
    productType?: string;
    price: number;
    currency?: string;
    size: string;
    measurements?: Record<string, any> | null;
    condition: string;
    status?: string;
    stockQuantity?: number;
    oneOfOne?: boolean;
    materials?: string | null;
    careInstructions?: string | null;
    transformationDescription?: string | null;
    originalGarmentDescription?: string | null;
    featured?: boolean;
    images?: Array<{ url: string; altText?: string | null; isPrimary?: boolean; sortOrder?: number }>;
  }): Promise<ProductRecord> {
    const id = uuidv4();
    const rows = await query<ProductRecord>(
      `INSERT INTO products (
        id, name, slug, description, category_id, product_type, price, currency,
        size, measurements, condition, status, stock_quantity, one_of_one,
        materials, care_instructions, transformation_description, original_garment_description,
        featured
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *`,
      [
        id,
        data.name,
        data.slug,
        data.description,
        data.categoryId,
        data.productType || 'CURATED',
        data.price,
        data.currency || 'KES',
        data.size,
        data.measurements ? JSON.stringify(data.measurements) : null,
        data.condition,
        data.status || 'PUBLISHED',
        data.stockQuantity !== undefined ? data.stockQuantity : 1,
        data.oneOfOne !== undefined ? data.oneOfOne : true,
        data.materials || null,
        data.careInstructions || null,
        data.transformationDescription || null,
        data.originalGarmentDescription || null,
        data.featured || false,
      ]
    );

    const product = rows[0];

    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        const img = data.images[i];
        await query(
          `INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            uuidv4(),
            id,
            img.url,
            img.altText || data.name,
            img.isPrimary ?? (i === 0),
            img.sortOrder ?? i,
          ]
        );
      }
    }

    return (await this.findById(id))!;
  }

  async update(id: string, data: Partial<{
    name: string;
    slug: string;
    description: string;
    categoryId: string;
    productType: string;
    price: number;
    currency: string;
    size: string;
    measurements: Record<string, any> | null;
    condition: string;
    status: string;
    stockQuantity: number;
    oneOfOne: boolean;
    materials: string | null;
    careInstructions: string | null;
    transformationDescription: string | null;
    originalGarmentDescription: string | null;
    featured: boolean;
    images: Array<{ url: string; altText?: string | null; isPrimary?: boolean; sortOrder?: number }>;
  }>): Promise<ProductRecord | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    const setField = (col: string, val: any) => {
      fields.push(`${col} = $${idx++}`);
      values.push(val);
    };

    if (data.name !== undefined) setField('name', data.name);
    if (data.slug !== undefined) setField('slug', data.slug);
    if (data.description !== undefined) setField('description', data.description);
    if (data.categoryId !== undefined) setField('category_id', data.categoryId);
    if (data.productType !== undefined) setField('product_type', data.productType);
    if (data.price !== undefined) setField('price', data.price);
    if (data.currency !== undefined) setField('currency', data.currency);
    if (data.size !== undefined) setField('size', data.size);
    if (data.measurements !== undefined) setField('measurements', data.measurements ? JSON.stringify(data.measurements) : null);
    if (data.condition !== undefined) setField('condition', data.condition);
    if (data.status !== undefined) setField('status', data.status);
    if (data.stockQuantity !== undefined) setField('stock_quantity', data.stockQuantity);
    if (data.oneOfOne !== undefined) setField('one_of_one', data.oneOfOne);
    if (data.materials !== undefined) setField('materials', data.materials);
    if (data.careInstructions !== undefined) setField('care_instructions', data.careInstructions);
    if (data.transformationDescription !== undefined) setField('transformation_description', data.transformationDescription);
    if (data.originalGarmentDescription !== undefined) setField('original_garment_description', data.originalGarmentDescription);
    if (data.featured !== undefined) setField('featured', data.featured);

    if (fields.length > 0) {
      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);
      await query(`UPDATE products SET ${fields.join(', ')} WHERE id = $${idx}`, values);
    }

    if (data.images !== undefined) {
      await query('DELETE FROM product_images WHERE product_id = $1', [id]);
      for (let i = 0; i < data.images.length; i++) {
        const img = data.images[i];
        await query(
          `INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            uuidv4(),
            id,
            img.url,
            img.altText || null,
            img.isPrimary ?? (i === 0),
            img.sortOrder ?? i,
          ]
        );
      }
    }

    return this.findById(id);
  }

  async markSold(id: string): Promise<void> {
    await query(
      `UPDATE products SET status = 'SOLD', stock_quantity = 0, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [id]
    );
  }

  async delete(id: string): Promise<boolean> {
    const res = await query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
    return res.length > 0;
  }

  async getFeaturedDrop(limit = 6): Promise<ProductRecord[]> {
    const products = await query<ProductRecord>(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.status = 'PUBLISHED'
       ORDER BY p.featured DESC, p.created_at DESC
       LIMIT $1`,
      [limit]
    );

    for (const p of products) {
      p.images = await this.findProductImages(p.id);
    }
    return products;
  }
}

export const productRepository = new ProductRepository();
