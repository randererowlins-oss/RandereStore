import { PaymentProvider, PaymentInitiationParams, PaymentInitiationResult, PaymentVerificationResult } from './payment.interface.js';
import { MpesaPaymentProvider } from './mpesa.provider.js';
import { CardPaymentProvider, CashOnDeliveryProvider } from './card.provider.js';
import { BadRequestError } from '../../utils/errors.js';

export class PaymentService {
  private providers: Map<string, PaymentProvider> = new Map();

  constructor() {
    this.registerProvider(new MpesaPaymentProvider());
    this.registerProvider(new CardPaymentProvider());
    this.registerProvider(new CashOnDeliveryProvider());
  }

  public registerProvider(provider: PaymentProvider) {
    this.providers.set(provider.name.toUpperCase(), provider);
  }

  public getProvider(name: string): PaymentProvider {
    const provider = this.providers.get(name.toUpperCase());
    if (!provider) {
      throw new BadRequestError(`Unsupported payment provider: ${name}. Available: ${Array.from(this.providers.keys()).join(', ')}`);
    }
    return provider;
  }

  public async initiatePayment(method: string, params: PaymentInitiationParams): Promise<PaymentInitiationResult> {
    const provider = this.getProvider(method);
    return provider.createPayment(params);
  }

  public async verifyPayment(method: string, transactionId: string): Promise<PaymentVerificationResult> {
    const provider = this.getProvider(method);
    return provider.verifyPayment(transactionId);
  }
}

export const paymentService = new PaymentService();
