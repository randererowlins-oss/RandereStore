import {
  PaymentProvider,
  PaymentInitiationParams,
  PaymentInitiationResult,
  PaymentVerificationResult,
  PaymentRefundResult,
} from './payment.interface.js';
import crypto from 'crypto';

export class CardPaymentProvider implements PaymentProvider {
  public name = 'CARD';

  async createPayment(params: PaymentInitiationParams): Promise<PaymentInitiationResult> {
    const txnId = `card_tx_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    return {
      success: true,
      transactionId: txnId,
      provider: 'CARD',
      instructions: `Card authorization initialized for KES ${params.amount.toLocaleString()}. Ready for secure 3DS processing.`,
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentVerificationResult> {
    return {
      isPaid: true,
      transactionId,
      amount: 0,
      currency: 'KES',
      status: 'PAID',
    };
  }

  async refundPayment(transactionId: string, amount?: number): Promise<PaymentRefundResult> {
    return {
      success: true,
      refundId: `REF_CARD_${Date.now()}`,
      amount: amount || 0,
    };
  }
}

export class CashOnDeliveryProvider implements PaymentProvider {
  public name = 'COD';

  async createPayment(params: PaymentInitiationParams): Promise<PaymentInitiationResult> {
    const txnId = `cod_ref_${Date.now()}`;
    return {
      success: true,
      transactionId: txnId,
      provider: 'COD',
      instructions: `Cash on Delivery / Studio Pickup selected. Payment of KES ${params.amount.toLocaleString()} will be collected upon delivery/pickup.`,
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentVerificationResult> {
    return {
      isPaid: false,
      transactionId,
      amount: 0,
      currency: 'KES',
      status: 'PENDING',
    };
  }

  async refundPayment(transactionId: string, amount?: number): Promise<PaymentRefundResult> {
    return {
      success: true,
      refundId: `REF_COD_${Date.now()}`,
      amount: amount || 0,
    };
  }
}
