import { z } from 'zod';

export const createStorySchema = z.object({
  title: z.string().min(3, 'Title is required'),
  excerpt: z.string().min(10, 'Excerpt is required'),
  body: z.string().min(20, 'Body content is required'),
  coverImage: z.string().url('Cover image must be a valid URL'),
  author: z.string().default('RANDERE Studio'),
  tags: z.array(z.string()).default([]),
  contentType: z.enum([
    'story',
    'transformation',
    'artist_feature',
    'style_guide',
    'behind_the_scenes',
    'collaboration',
  ]).default('story'),
  published: z.boolean().default(true),
  readTimeMinutes: z.number().int().positive().default(3),
});

export const updateStorySchema = createStorySchema.partial();
