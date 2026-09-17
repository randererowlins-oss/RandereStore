import { z } from 'zod';

export const createOrderSchema = z.object({
  customerName: z.string().min(2, 'Customer name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().min(9, 'Valid phone number is required (e.g. +254 7XX XXX XXX)'),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(9),
    streetAddress: z.string().min(3),
    estate: z.string().optional().nullable(),
    city: z.string().min(2),
    postalCode: z.string().optional().nullable(),
    country: z.string().default('Kenya'),
  }),
  paymentMethod: z.enum(['MPESA', 'CARD', 'COD']).default('MPESA'),
  deliveryNotes: z.string().optional().nullable(),
  // Items submitted only contain productId and requested quantity.
  // Prices are ALWAYS looked up server-side from PostgreSQL.
  items: z.array(z.object({
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z.number().int().positive().default(1),
  })).min(1, 'Order must contain at least one item'),
});

export const updateOrderStatusSchema = z.object({
  paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']).optional(),
  fulfillmentStatus: z.enum(['PROCESSING', 'READY', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
  paymentReference: z.string().optional(),
});
