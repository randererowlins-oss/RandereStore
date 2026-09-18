import { query, queryOne } from '../config/database.js';
import { TransformationRecord } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';

export class TransformationRepository {
  async findById(id: string): Promise<TransformationRecord | null> {
    return queryOne<TransformationRecord>('SELECT * FROM transformations WHERE id = $1', [id]);
  }

  async findBySlug(slug: string): Promise<TransformationRecord | null> {
    return queryOne<TransformationRecord>('SELECT * FROM transformations WHERE slug = $1', [slug]);
  }

  async findAll(publishedOnly = true): Promise<TransformationRecord[]> {
    const where = publishedOnly ? 'WHERE published = TRUE' : '';
    return query<TransformationRecord>(
      `SELECT * FROM transformations ${where} ORDER BY created_at DESC`
    );
  }

  async create(data: {
    title: string;
    slug: string;
    garmentType: string;
    originalGarmentDescription: string;
    originalGarmentImageUrl: string;
    processDescription: string;
    processImageUrls: string[];
    finalGarmentDescription: string;
    finalGarmentImageUrl: string;
    techniques: string[];
    artistAttribution?: string | null;
    tailorAttribution?: string | null;
    relatedProductId?: string | null;
    published?: boolean;
  }): Promise<TransformationRecord> {
    const id = uuidv4();
    const rows = await query<TransformationRecord>(
      `INSERT INTO transformations (
        id, title, slug, garment_type,
        original_garment_description, original_garment_image_url,
        process_description, process_image_urls,
        final_garment_description, final_garment_image_url,
        techniques, artist_attribution, tailor_attribution,
        related_product_id, published
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        id,
        data.title,
        data.slug,
        data.garmentType,
        data.originalGarmentDescription,
        data.originalGarmentImageUrl,
        data.processDescription,
        JSON.stringify(data.processImageUrls || []),
        data.finalGarmentDescription,
        data.finalGarmentImageUrl,
        JSON.stringify(data.techniques || []),
        data.artistAttribution || null,
        data.tailorAttribution || null,
        data.relatedProductId || null,
        data.published !== undefined ? data.published : true,
      ]
    );
    return rows[0];
  }

  async update(id: string, data: Partial<{
    title: string;
    slug: string;
    garmentType: string;
    originalGarmentDescription: string;
    originalGarmentImageUrl: string;
    processDescription: string;
    processImageUrls: string[];
    finalGarmentDescription: string;
    finalGarmentImageUrl: string;
    techniques: string[];
    artistAttribution: string | null;
    tailorAttribution: string | null;
    relatedProductId: string | null;
    published: boolean;
  }>): Promise<TransformationRecord | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    const setField = (col: string, val: any) => {
      fields.push(`${col} = $${idx++}`);
      values.push(val);
    };

    if (data.title !== undefined) setField('title', data.title);
    if (data.slug !== undefined) setField('slug', data.slug);
    if (data.garmentType !== undefined) setField('garment_type', data.garmentType);
    if (data.originalGarmentDescription !== undefined) setField('original_garment_description', data.originalGarmentDescription);
    if (data.originalGarmentImageUrl !== undefined) setField('original_garment_image_url', data.originalGarmentImageUrl);
    if (data.processDescription !== undefined) setField('process_description', data.processDescription);
    if (data.processImageUrls !== undefined) setField('process_image_urls', JSON.stringify(data.processImageUrls));
    if (data.finalGarmentDescription !== undefined) setField('final_garment_description', data.finalGarmentDescription);
    if (data.finalGarmentImageUrl !== undefined) setField('final_garment_image_url', data.finalGarmentImageUrl);
    if (data.techniques !== undefined) setField('techniques', JSON.stringify(data.techniques));
    if (data.artistAttribution !== undefined) setField('artist_attribution', data.artistAttribution);
    if (data.tailorAttribution !== undefined) setField('tailor_attribution', data.tailorAttribution);
    if (data.relatedProductId !== undefined) setField('related_product_id', data.relatedProductId);
    if (data.published !== undefined) setField('published', data.published);

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    return queryOne<TransformationRecord>(
      `UPDATE transformations SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
  }

  async delete(id: string): Promise<boolean> {
    const res = await query('DELETE FROM transformations WHERE id = $1 RETURNING id', [id]);
    return res.length > 0;
  }
}

export const transformationRepository = new TransformationRepository();
