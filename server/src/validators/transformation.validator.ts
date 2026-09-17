import { z } from 'zod';

export const createTransformationSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  garmentType: z.string().min(2, 'Garment type is required'),
  originalGarmentDescription: z.string().min(10, 'Original description is required'),
  originalGarmentImageUrl: z.string().url('Original image URL is required'),
  processDescription: z.string().min(10, 'Process description is required'),
  processImageUrls: z.array(z.string()).default([]),
  finalGarmentDescription: z.string().min(10, 'Final description is required'),
  finalGarmentImageUrl: z.string().url('Final image URL is required'),
  techniques: z.array(z.string()).min(1, 'At least one technique is required'),
  artistAttribution: z.string().optional().nullable(),
  tailorAttribution: z.string().optional().nullable(),
  relatedProductId: z.string().optional().nullable(),
  published: z.boolean().default(true),
});

export const updateTransformationSchema = createTransformationSchema.partial();
