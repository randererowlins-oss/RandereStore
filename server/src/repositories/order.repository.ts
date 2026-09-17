import { query, queryOne } from '../config/database.js';
import { OrderRecord, OrderItemRecord, PaymentStatus, FulfillmentStatus } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';

export class OrderRepository {
  async findById(id: string): Promise<OrderRecord | null> {
    const order = await queryOne<OrderRecord>('SELECT * FROM orders WHERE id = $1', [id]);
    if (!order) return null;
    order.items = await this.findOrderItems(order.id);
    return order;
  }

  async findByOrderNumber(orderNumber: string): Promise<OrderRecord | null> {
    const order = await queryOne<OrderRecord>('SELECT * FROM orders WHERE order_number = $1', [orderNumber]);
    if (!order) return null;
    order.items = await this.findOrderItems(order.id);
    return order;
  }

  async findOrderItems(orderId: string): Promise<OrderItemRecord[]> {
    return query<OrderItemRecord>('SELECT * FROM order_items WHERE order_id = $1 ORDER BY created_at ASC', [orderId]);
  }

  async findByUserId(userId: string): Promise<OrderRecord[]> {
    const orders = await query<OrderRecord>(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    for (const ord of orders) {
      ord.items = await this.findOrderItems(ord.id);
    }
    return orders;
  }

  async findAll(params: {
    status?: string;
    fulfillmentStatus?: string;
    page?: number;
    limit?: number;
  }): Promise<{ orders: OrderRecord[]; total: number; page: number; limit: number; totalPages: number }> {
    const conditions: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (params.status) {
      conditions.push(`payment_status = $${idx++}`);
      values.push(params.status);
    }

    if (params.fulfillmentStatus) {
      conditions.push(`fulfillment_status = $${idx++}`);
      values.push(params.fulfillmentStatus);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const countRes = await queryOne<{ count: string }>(`SELECT COUNT(*) as count FROM orders ${where}`, values);
    const total = parseInt(countRes?.count || '0', 10);

    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;

    const orders = await query<OrderRecord>(
      `SELECT * FROM orders ${where} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
      [...values, limit, offset]
    );

    for (const ord of orders) {
      ord.items = await this.findOrderItems(ord.id);
    }

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async create(data: {
    orderNumber: string;
    userId?: string | null;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: any;
    subtotal: number;
    shippingFee: number;
    total: number;
    currency?: string;
    paymentStatus?: PaymentStatus;
    paymentMethod: string;
    paymentReference?: string | null;
    fulfillmentStatus?: FulfillmentStatus;
    deliveryNotes?: string | null;
    items: Array<{
      productId: string;
      productName: string;
      productType: string;
      price: number;
      quantity: number;
      size: string;
      imageUrl?: string | null;
    }>;
  }): Promise<OrderRecord> {
    const id = uuidv4();
    const rows = await query<OrderRecord>(
      `INSERT INTO orders (
        id, order_number, user_id, customer_name, customer_email, customer_phone,
        shipping_address, subtotal, shipping_fee, total, currency,
        payment_status, payment_method, payment_reference, fulfillment_status, delivery_notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *`,
      [
        id,
        data.orderNumber,
        data.userId || null,
        data.customerName,
        data.customerEmail,
        data.customerPhone,
        JSON.stringify(data.shippingAddress),
        data.subtotal,
        data.shippingFee,
        data.total,
        data.currency || 'KES',
        data.paymentStatus || 'PENDING',
        data.paymentMethod,
        data.paymentReference || null,
        data.fulfillmentStatus || 'PROCESSING',
        data.deliveryNotes || null,
      ]
    );

    const order = rows[0];

    for (const item of data.items) {
      await query(
        `INSERT INTO order_items (id, order_id, product_id, product_name, product_type, price, quantity, size, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          uuidv4(),
          id,
          item.productId,
          item.productName,
          item.productType,
          item.price,
          item.quantity,
          item.size,
          item.imageUrl || null,
        ]
      );
    }

    return (await this.findById(id))!;
  }

  async updateStatus(id: string, updates: {
    paymentStatus?: PaymentStatus;
    fulfillmentStatus?: FulfillmentStatus;
    paymentReference?: string;
  }): Promise<OrderRecord | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (updates.paymentStatus) {
      fields.push(`payment_status = $${idx++}`);
      values.push(updates.paymentStatus);
    }
    if (updates.fulfillmentStatus) {
      fields.push(`fulfillment_status = $${idx++}`);
      values.push(updates.fulfillmentStatus);
    }
    if (updates.paymentReference) {
      fields.push(`payment_reference = $${idx++}`);
      values.push(updates.paymentReference);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    await query(`UPDATE orders SET ${fields.join(', ')} WHERE id = $${idx}`, values);
    return this.findById(id);
  }

  async getAdminStats(): Promise<{
    totalSales: number;
    totalOrders: number;
    pendingOrders: number;
    totalProducts: number;
    soldProducts: number;
    customRequests: number;
    stylingRequests: number;
  }> {
    const salesRes = await queryOne<{ total: string }>(
      `SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE payment_status = 'PAID'`
    );
    const ordersRes = await queryOne<{ count: string }>('SELECT COUNT(*) as count FROM orders');
    const pendingOrdersRes = await queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM orders WHERE fulfillment_status = 'PROCESSING' OR payment_status = 'PENDING'`
    );
    const productsRes = await queryOne<{ count: string }>('SELECT COUNT(*) as count FROM products');
    const soldProductsRes = await queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM products WHERE status = 'SOLD'`
    );
    const customReqRes = await queryOne<{ count: string }>('SELECT COUNT(*) as count FROM custom_requests');
    const stylingReqRes = await queryOne<{ count: string }>('SELECT COUNT(*) as count FROM styling_requests');

    return {
      totalSales: parseFloat(salesRes?.total || '0'),
      totalOrders: parseInt(ordersRes?.count || '0', 10),
      pendingOrders: parseInt(pendingOrdersRes?.count || '0', 10),
      totalProducts: parseInt(productsRes?.count || '0', 10),
      soldProducts: parseInt(soldProductsRes?.count || '0', 10),
      customRequests: parseInt(customReqRes?.count || '0', 10),
      stylingRequests: parseInt(stylingReqRes?.count || '0', 10),
    };
  }
}

export const orderRepository = new OrderRepository();
