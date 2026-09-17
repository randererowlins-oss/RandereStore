import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { seedDatabase } from '../seed.js';

let app: any;
let adminToken: string;
let customer1Token: string;
let customer2Token: string;
let sampleProductId: string;
let oneOfOneProductId: string;
let sampleProductPrice: number;

beforeAll(async () => {
  await seedDatabase();
  const { query } = await import('../config/database.js');
  await query("UPDATE products SET status = 'PUBLISHED', stock_quantity = 5 WHERE one_of_one = false");
  await query("UPDATE products SET status = 'PUBLISHED', stock_quantity = 1 WHERE one_of_one = true");

  app = createApp();


  // Login as admin
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@randere.studio', password: 'randere2026' });
  adminToken = adminRes.body.data.token;

  // Login as customer 1
  const c1Res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'kevo@randere.studio', password: 'randere2026' });
  customer1Token = c1Res.body.data.token;

  // Login as customer 2
  const c2Res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'shiko@randere.studio', password: 'randere2026' });
  customer2Token = c2Res.body.data.token;

  // Get sample products
  const productsRes = await request(app).get('/api/products');
  const products = productsRes.body.data;
  const multiStockProduct = products.find((p: any) => p.one_of_one === false && p.stock_quantity > 1);
  const oneOfOneProducts = products.filter((p: any) => p.one_of_one === true && p.status === 'PUBLISHED');

  sampleProductId = multiStockProduct.id;
  sampleProductPrice = parseFloat(multiStockProduct.price);
  oneOfOneProductId = oneOfOneProducts[0].id;

});

describe('1. Authentication & Security', () => {
  it('should reject invalid credentials with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@randere.studio', password: 'wrongpassword' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should authenticate user and return me endpoint data', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${customer1Token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('kevo@randere.studio');
    expect(res.body.data.role).toBe('CUSTOMER');
  });

  it('Scenario 4: Non-admin cannot access admin endpoints (403 Forbidden)', async () => {
    const res = await request(app)
      .get('/api/admin/metrics')
      .set('Authorization', `Bearer ${customer1Token}`);
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('Admin can access admin metrics endpoint (200 OK)', async () => {
    const res = await request(app)
      .get('/api/admin/metrics')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.totalProducts).toBeGreaterThan(0);
  });
});

describe('2. Products & Catalogue API', () => {
  it('should list published products with proper pagination', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should filter products by category', async () => {
    const res = await request(app).get('/api/products?category=curated');
    expect(res.status).toBe(200);
    expect(res.body.data.every((p: any) => p.category_slug === 'curated')).toBe(true);
  });

  it('should return 404 for non-existent product slug', async () => {
    const res = await request(app).get('/api/products/non-existent-jacket-xyz');
    expect(res.status).toBe(404);
  });
});

describe('3. Cart & Bag Operations', () => {
  it('should add item to bag and calculate subtotal accurately', async () => {
    const res = await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${customer1Token}`)
      .send({ productId: sampleProductId, quantity: 1 });
    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeGreaterThan(0);
    expect(res.body.data.subtotal).toBeGreaterThan(0);
  });

  it('Scenario 8: Cart remains consistent and allows item removal', async () => {
    const res = await request(app)
      .delete(`/api/cart/items/${sampleProductId}`)
      .set('Authorization', `Bearer ${customer1Token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.items.find((i: any) => i.productId === sampleProductId)).toBeUndefined();
  });
});

describe('4. Checkout, Pricing Security & Inventory Concurrency', () => {
  it('Scenario 5: Client cannot manipulate price — server recalculates from DB', async () => {
    const orderPayload = {
      customerName: 'Test Buyer',
      customerEmail: 'buyer@example.com',
      customerPhone: '+254711999888',
      shippingAddress: {
        fullName: 'Test Buyer',
        phone: '+254711999888',
        streetAddress: 'Westlands Mall Rd',
        city: 'Nairobi',
        country: 'Kenya',
      },
      paymentMethod: 'MPESA',
      // Notice: client tries to send items with an arbitrary fake cheap price, but backend only takes productId & quantity
      items: [{ productId: sampleProductId, quantity: 1, price: 10 }],
    };

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customer1Token}`)
      .send(orderPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    // Subtotal must match the real database price, NOT 10 KES!
    expect(parseFloat(res.body.data.order.subtotal)).toBe(sampleProductPrice);
  });

  it('Scenario 2: One-of-one item cannot be purchased twice', async () => {
    // Attempt 1: Purchase the one-of-one item
    const orderPayload = {
      customerName: 'First Buyer',
      customerEmail: 'first@example.com',
      customerPhone: '+254711222333',
      shippingAddress: {
        fullName: 'First Buyer',
        phone: '+254711222333',
        streetAddress: 'Karen Road 12',
        city: 'Nairobi',
        country: 'Kenya',
      },
      paymentMethod: 'MPESA',
      items: [{ productId: oneOfOneProductId, quantity: 1 }],
    };

    const firstAttempt = await request(app).post('/api/orders').send(orderPayload);
    expect(firstAttempt.status).toBe(201);

    // Scenario 1 & 2: Second attempt must fail because the item is now SOLD OUT
    const secondAttempt = await request(app).post('/api/orders').send(orderPayload);
    expect(secondAttempt.status).toBe(400);
    expect(secondAttempt.body.message).toMatch(/no longer available|insufficient stock/i);
  });

  it('Scenario 3: Customer cannot access another customer order', async () => {
    // Create an order as customer 1
    const orderRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customer1Token}`)
      .send({
        customerName: 'Kevo Mwangi',
        customerEmail: 'kevo@randere.studio',
        customerPhone: '+254722111222',
        shippingAddress: {
          fullName: 'Kevo Mwangi',
          phone: '+254722111222',
          streetAddress: 'Kilimani Creative Hub',
          city: 'Nairobi',
          country: 'Kenya',
        },
        paymentMethod: 'CARD',
        items: [{ productId: sampleProductId, quantity: 1 }],
      });

    const orderId = orderRes.body.data.order.id;

    // Customer 2 attempts to fetch Customer 1's order
    const breachRes = await request(app)
      .get(`/api/orders/${orderId}`)
      .set('Authorization', `Bearer ${customer2Token}`);

    expect(breachRes.status).toBe(403);
    expect(breachRes.body.success).toBe(false);

    // Admin CAN fetch customer order
    const adminRes = await request(app)
      .get(`/api/orders/${orderId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(adminRes.status).toBe(200);
  });
});

describe('5. Custom Requests & Validation', () => {
  it('Scenario 6: Invalid custom requests are rejected with 400', async () => {
    const invalidPayload = {
      customerName: 'A', // too short
      customerEmail: 'not-an-email',
      // missing phone, garmentType, description
    };

    const res = await request(app).post('/api/custom-requests').send(invalidPayload);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it('Valid custom request is accepted and created', async () => {
    const validPayload = {
      customerName: 'David Ochieng',
      customerEmail: 'david@example.com',
      customerPhone: '+254700112233',
      garmentType: 'Vintage Trench Coat',
      serviceTypes: ['reconstruction', 'painting'],
      budget: 8000,
      description: 'Crop to double-breasted jacket length and add black stencil motifs on shoulders.',
    };

    const res = await request(app).post('/api/custom-requests').send(validPayload);
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('SUBMITTED');
  });
});
