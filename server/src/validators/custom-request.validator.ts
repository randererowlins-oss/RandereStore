import { z } from 'zod';

export const createCustomRequestSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().min(9, 'Valid phone number is required'),
  garmentType: z.string().min(2, 'Garment type is required (e.g. Denim Jacket, Hoodie, Trousers)'),
  serviceTypes: z.array(z.string()).min(1, 'Please select at least one transformation service'),
  budget: z.coerce.number().positive().optional().nullable(),
  deadline: z.string().optional().nullable(),
  description: z.string().min(10, 'Please describe your transformation vision (min 10 characters)'),
  garmentPhotos: z.array(z.string()).optional().default([]),
  inspirationPhotos: z.array(z.string()).optional().default([]),
});

export const updateCustomRequestStatusSchema = z.object({
  status: z.enum([
    'SUBMITTED',
    'REVIEWING',
    'QUOTED',
    'APPROVED',
    'IN_PROGRESS',
    'READY',
    'COMPLETED',
    'DECLINED',
  ]),
  quoteAmount: z.coerce.number().optional().nullable(),
  adminNotes: z.string().optional().nullable(),
});
