export interface PaymentInitiationParams {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  metadata?: Record<string, any>;
}

export interface PaymentInitiationResult {
  success: boolean;
  transactionId: string;
  provider: string;
  checkoutUrl?: string;
  instructions?: string;
  rawResponse?: any;
}

export interface PaymentVerificationResult {
  isPaid: boolean;
  transactionId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  metadata?: Record<string, any>;
}

export interface PaymentRefundResult {
  success: boolean;
  refundId: string;
  amount: number;
}

export interface PaymentProvider {
  name: string;
  createPayment(params: PaymentInitiationParams): Promise<PaymentInitiationResult>;
  verifyPayment(transactionId: string): Promise<PaymentVerificationResult>;
  refundPayment(transactionId: string, amount?: number): Promise<PaymentRefundResult>;
}
