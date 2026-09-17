import { z } from 'zod';

export const createStylingRequestSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().min(9, 'Valid phone number is required'),
  occasion: z.string().min(2, 'Occasion is required (e.g. Creative Drop, Date Night, Photoshoot)'),
  eventDate: z.string().optional().nullable(),
  budget: z.coerce.number().positive().optional().nullable(),
  preferredAesthetic: z.string().min(2, 'Preferred aesthetic is required'),
  size: z.string().min(1, 'Size is required'),
  presentationPreference: z.string().min(1, 'Presentation preference is required (e.g. Unisex, Menswear, Womenswear)'),
  colorPreferences: z.string().optional().nullable(),
  referencePhotos: z.array(z.string()).optional().default([]),
  additionalNotes: z.string().optional().nullable(),
});

export const updateStylingRequestStatusSchema = z.object({
  status: z.enum(['SUBMITTED', 'REVIEWING', 'CURATED', 'COMPLETED', 'DECLINED']),
  stylistNotes: z.string().optional().nullable(),
});
