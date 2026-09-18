import { z } from 'zod';

export const productTypeEnum = z.enum(['CURATED', 'REMADE', 'ARTED', 'ACCESSORY']);
export const productStatusEnum = z.enum(['DRAFT', 'PUBLISHED', 'SOLD', 'ARCHIVED']);

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  description: z.string().min(10, 'Product description is required'),
  categoryId: z.string().min(1, 'Category is required'),
  productType: productTypeEnum.default('CURATED'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  currency: z.string().default('KES'),
  size: z.string().min(1, 'Size is required'),
  measurements: z.record(z.any()).optional().nullable(),
  condition: z.string().min(1, 'Condition is required'),
  status: productStatusEnum.default('PUBLISHED'),
  stockQuantity: z.coerce.number().int().min(0).default(1),
  oneOfOne: z.boolean().default(true),
  materials: z.string().optional().nullable(),
  careInstructions: z.string().optional().nullable(),
  transformationDescription: z.string().optional().nullable(),
  originalGarmentDescription: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  images: z.array(z.object({
    url: z.string().url('Invalid image URL'),
    altText: z.string().optional().nullable(),
    isPrimary: z.boolean().default(false),
    sortOrder: z.number().default(0),
  })).min(1, 'At least one image is required'),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  category: z.string().optional(),
  type: productTypeEnum.optional(),
  size: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  oneOfOne: z.preprocess((val) => val === 'true' ? true : val === 'false' ? false : undefined, z.boolean().optional()),
  status: productStatusEnum.optional(),
  condition: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(['newest', 'price-asc', 'price-desc', 'featured']).optional().default('newest'),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(24),
});
