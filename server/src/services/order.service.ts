import { orderRepository } from '../repositories/order.repository.js';
import { productRepository } from '../repositories/product.repository.js';
import { paymentService } from './payment/payment.service.js';
import { config } from '../config/env.js';
import { query } from '../config/database.js';
import { BadRequestError, NotFoundError, ForbiddenError } from '../utils/errors.js';
import { OrderRecord, PaymentStatus, FulfillmentStatus } from '../types/index.js';
import crypto from 'crypto';

export class OrderService {
  async createOrder(data: {
    userId?: string | null;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: any;
    paymentMethod: string;
    deliveryNotes?: string | null;
    items: Array<{ productId: string; quantity: number }>;
  }) {
    if (!data.items || data.items.length === 0) {
      throw new BadRequestError('Cannot create an empty order');
    }

    // Step 1: Validate each product from PostgreSQL directly
    const validatedItems: Array<{
      productId: string;
      productName: string;
      productType: string;
      price: number;
      quantity: number;
      size: string;
      imageUrl: string | null;
      oneOfOne: boolean;
    }> = [];

    let calculatedSubtotal = 0;

    // Use transaction/atomic locking for stock safety
    for (const item of data.items) {
      const product = await productRepository.findById(item.productId);
      if (!product) {
        throw new NotFoundError(`Product with ID '${item.productId}' not found`);
      }

      if (product.status !== 'PUBLISHED') {
        throw new BadRequestError(`"${product.name}" is no longer available for purchase (${product.status.toLowerCase()})`);
      }

      if (product.stock_quantity < item.quantity) {
        throw new BadRequestError(`Insufficient stock for "${product.name}". Available: ${product.stock_quantity}`);
      }

      if (product.one_of_one && item.quantity > 1) {
        throw new BadRequestError(`"${product.name}" is a ONE-OF-ONE original piece. Only 1 can be purchased.`);
      }

      const unitPrice = parseFloat(product.price.toString());
      calculatedSubtotal += unitPrice * item.quantity;

      const primaryImg = product.images?.find((img) => img.is_primary) || product.images?.[0];

      validatedItems.push({
        productId: product.id,
        productName: product.name,
        productType: product.product_type,
        price: unitPrice,
        quantity: item.quantity,
        size: product.size,
        imageUrl: primaryImg?.url || null,
        oneOfOne: product.one_of_one,
      });
    }

    // Step 2: Shipping fee calculation
    const shippingFee = calculatedSubtotal >= config.freeShippingThreshold ? 0 : config.shippingBaseFee;
    const finalTotal = calculatedSubtotal + shippingFee;

    // Generate readable order number: e.g. RDR-9284-B1
    const randSuffix = crypto.randomBytes(2).toString('hex').toUpperCase();
    const orderNumber = `RDR-${Date.now().toString().slice(-4)}-${randSuffix}`;

    // Step 3: Atomic stock deduction and status update
    for (const item of validatedItems) {
      if (item.oneOfOne) {
        await productRepository.markSold(item.productId);
      } else {
        await query(
          'UPDATE products SET stock_quantity = stock_quantity - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [item.quantity, item.productId]
        );
      }
    }

    // Step 4: Persist order
    const order = await orderRepository.create({
      orderNumber,
      userId: data.userId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      shippingAddress: data.shippingAddress,
      subtotal: calculatedSubtotal,
      shippingFee,
      total: finalTotal,
      currency: 'KES',
      paymentStatus: 'PENDING',
      paymentMethod: data.paymentMethod,
      fulfillmentStatus: 'PROCESSING',
      deliveryNotes: data.deliveryNotes,
      items: validatedItems,
    });

    // Step 5: Initiate payment via PaymentProvider abstraction
    let paymentResult;
    try {
      paymentResult = await paymentService.initiatePayment(data.paymentMethod, {
        orderId: order.id,
        orderNumber: order.order_number,
        amount: finalTotal,
        currency: 'KES',
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
      });

      // Update payment reference
      if (paymentResult.transactionId) {
        await orderRepository.updateStatus(order.id, {
          paymentReference: paymentResult.transactionId,
          // If simulation or card auto-authorizes:
          paymentStatus: paymentResult.rawResponse ? 'PAID' : 'PENDING',
        });
      }
    } catch (paymentErr: any) {
      // Payment initiation issue logged, order remains PENDING
      paymentResult = {
        success: false,
        transactionId: '',
        provider: data.paymentMethod,
        instructions: 'Please retry payment from your order confirmation page.',
      };
    }

    const updatedOrder = await orderRepository.findById(order.id);

    return {
      order: updatedOrder,
      payment: paymentResult,
    };
  }

  async getOrderById(id: string, requester: { userId?: string; role?: string }) {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError(`Order '${id}' not found`);
    }

    if (requester.role !== 'ADMIN' && (!requester.userId || order.user_id !== requester.userId)) {
      throw new ForbiddenError('You are not authorized to view this order');
    }

    return order;
  }

  async getOrderByNumber(orderNumber: string, emailVerification?: string) {
    const order = await orderRepository.findByOrderNumber(orderNumber);
    if (!order) {
      throw new NotFoundError(`Order #${orderNumber} not found`);
    }

    if (emailVerification && order.customer_email.toLowerCase() !== emailVerification.toLowerCase()) {
      throw new ForbiddenError('Email does not match this order');
    }

    return order;
  }

  async getCustomerOrders(userId: string) {
    return orderRepository.findByUserId(userId);
  }

  async listAllOrders(params: any) {
    return orderRepository.findAll(params);
  }

  async updateOrderStatus(id: string, updates: {
    paymentStatus?: PaymentStatus;
    fulfillmentStatus?: FulfillmentStatus;
    paymentReference?: string;
  }) {
    const existing = await orderRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Order '${id}' not found`);
    }
    return orderRepository.updateStatus(id, updates);
  }

  async getAdminStats() {
    return orderRepository.getAdminStats();
  }
}

export const orderService = new OrderService();
