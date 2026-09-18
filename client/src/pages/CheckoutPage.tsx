import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../hooks/useCart.js';
import { useAuth } from '../hooks/useAuth.js';
import { api } from '../lib/api.js';
import { formatKES } from '../lib/utils.js';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(9, 'Valid phone number is required (e.g. +254 7XX XXX XXX)'),
  streetAddress: z.string().min(3, 'Delivery address is required'),
  estate: z.string().optional(),
  city: z.string().min(2, 'City/Town is required'),
  deliveryNotes: z.string().optional(),
  paymentMethod: z.enum(['MPESA', 'CARD', 'COD']),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      streetAddress: '',
      estate: '',
      city: 'Nairobi',
      deliveryNotes: '',
      paymentMethod: 'MPESA',
    },
  });

  const selectedPayment = watch('paymentMethod');
  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold uppercase text-white font-sans">
          YOUR BAG IS EMPTY
        </h2>
        <p className="text-xs font-mono text-neutral-400">
          Add a piece to your bag before checking out.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-randere-chalk text-black px-6 py-2.5 text-xs font-mono font-bold uppercase"
        >
          EXPLORE DROPS
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setSubmitting(true);
      setErrorMessage(null);

      const orderPayload = {
        customerName: data.fullName,
        customerEmail: data.email,
        customerPhone: data.phone,
        shippingAddress: {
          fullName: data.fullName,
          phone: data.phone,
          streetAddress: data.streetAddress,
          estate: data.estate,
          city: data.city,
          country: 'Kenya',
        },
        paymentMethod: data.paymentMethod,
        deliveryNotes: data.deliveryNotes,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      };

      const res = await api.post('/orders', orderPayload);

      if (res.success && res.data?.order) {
        // Clear local bag upon successful order placement
        await clearCart();
        navigate(`/order-confirmation/${res.data.order.order_number}`, {
          state: { order: res.data.order, payment: res.data.payment },
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while placing your order. Please verify and retry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-randere-border">
        <div>
          <span className="text-xs font-mono tracking-mega text-randere-accent uppercase block mb-1">
            [ KENYA DIRECT COMMERCE ]
          </span>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white font-sans">
            SECURE CHECKOUT
          </h1>
        </div>
        <Link
          to="/cart"
          className="text-xs font-mono text-randere-muted hover:text-white uppercase flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          RETURN TO BAG
        </Link>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-950/40 border border-red-700/80 text-xs font-mono text-red-200 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Details Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Contact Info */}
            <div className="p-6 bg-randere-card/40 border border-randere-border space-y-4">
              <h3 className="text-xs font-mono tracking-widest text-randere-accent uppercase pb-2 border-b border-randere-border">
                01 // CUSTOMER DETAILS
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    {...register('fullName')}
                    className="w-full bg-neutral-900 border border-randere-border px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
                    placeholder="e.g. Kevo Mwangi"
                  />
                  {errors.fullName && (
                    <span className="text-[10px] text-red-400 font-mono mt-1 block">
                      {errors.fullName.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    PHONE (M-PESA ENABLED) *
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full bg-neutral-900 border border-randere-border px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
                    placeholder="e.g. 0712 345 678"
                  />
                  {errors.phone && (
                    <span className="text-[10px] text-red-400 font-mono mt-1 block">
                      {errors.phone.message}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full bg-neutral-900 border border-randere-border px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
                  placeholder="name@domain.com"
                />
                {errors.email && (
                  <span className="text-[10px] text-red-400 font-mono mt-1 block">
                    {errors.email.message}
                  </span>
                )}
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="p-6 bg-randere-card/40 border border-randere-border space-y-4">
              <h3 className="text-xs font-mono tracking-widest text-randere-accent uppercase pb-2 border-b border-randere-border">
                02 // DISPATCH DESTINATION (KENYA)
              </h3>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  STREET / BUILDING / APARTMENT *
                </label>
                <input
                  type="text"
                  {...register('streetAddress')}
                  className="w-full bg-neutral-900 border border-randere-border px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
                  placeholder="e.g. Studio 4B, Wood Avenue"
                />
                {errors.streetAddress && (
                  <span className="text-[10px] text-red-400 font-mono mt-1 block">
                    {errors.streetAddress.message}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    ESTATE / NEIGHBORHOOD
                  </label>
                  <input
                    type="text"
                    {...register('estate')}
                    className="w-full bg-neutral-900 border border-randere-border px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
                    placeholder="e.g. Kilimani, Westlands, Nyali"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    CITY / REGION *
                  </label>
                  <select
                    {...register('city')}
                    className="w-full bg-neutral-900 border border-randere-border px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
                  >
                    <option value="Nairobi">Nairobi</option>
                    <option value="Mombasa">Mombasa</option>
                    <option value="Kisumu">Kisumu</option>
                    <option value="Nakuru">Nakuru</option>
                    <option value="Eldoret">Eldoret</option>
                    <option value="Other Upcountry">Other Upcountry Location</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  DELIVERY NOTES (OPTIONAL)
                </label>
                <textarea
                  {...register('deliveryNotes')}
                  rows={2}
                  className="w-full bg-neutral-900 border border-randere-border p-3 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
                  placeholder="Special instructions for rider/courier (gate code, landmark, calling preferences)..."
                />
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="p-6 bg-randere-card/40 border border-randere-border space-y-4">
              <h3 className="text-xs font-mono tracking-widest text-randere-accent uppercase pb-2 border-b border-randere-border">
                03 // SETTLEMENT METHOD
              </h3>

              <div className="space-y-3">
                {/* M-PESA Option */}
                <label
                  className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                    selectedPayment === 'MPESA'
                      ? 'bg-neutral-900 border-randere-accent'
                      : 'border-randere-border hover:border-neutral-600'
                  }`}
                >
                  <input
                    type="radio"
                    value="MPESA"
                    {...register('paymentMethod')}
                    className="mt-0.5 text-randere-accent focus:ring-0"
                  />
                  <div>
                    <span className="block text-xs font-mono font-bold text-white uppercase">
                      LIPA NA M-PESA (STK PUSH EXPRESS)
                    </span>
                    <span className="block text-[11px] font-mono text-neutral-400 mt-0.5">
                      You will receive an instant prompt on your phone to input your M-PESA PIN.
                    </span>
                  </div>
                </label>

                {/* Card Option */}
                <label
                  className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                    selectedPayment === 'CARD'
                      ? 'bg-neutral-900 border-randere-accent'
                      : 'border-randere-border hover:border-neutral-600'
                  }`}
                >
                  <input
                    type="radio"
                    value="CARD"
                    {...register('paymentMethod')}
                    className="mt-0.5 text-randere-accent focus:ring-0"
                  />
                  <div>
                    <span className="block text-xs font-mono font-bold text-white uppercase">
                      CREDIT / DEBIT CARD (VISA / MASTERCARD)
                    </span>
                    <span className="block text-[11px] font-mono text-neutral-400 mt-0.5">
                      Secure encrypted card gateway with 3D-Secure authentication.
                    </span>
                  </div>
                </label>

                {/* COD Option */}
                <label
                  className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                    selectedPayment === 'COD'
                      ? 'bg-neutral-900 border-randere-accent'
                      : 'border-randere-border hover:border-neutral-600'
                  }`}
                >
                  <input
                    type="radio"
                    value="COD"
                    {...register('paymentMethod')}
                    className="mt-0.5 text-randere-accent focus:ring-0"
                  />
                  <div>
                    <span className="block text-xs font-mono font-bold text-white uppercase">
                      PAY ON DELIVERY / STUDIO PICKUP (NAIROBI ONLY)
                    </span>
                    <span className="block text-[11px] font-mono text-neutral-400 mt-0.5">
                      Settle via M-PESA or cash upon inspecting your garment at our Kilimani studio or via dispatch rider.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Bag Review Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-randere-card/50 border border-randere-border space-y-6 sticky top-24">
              <h3 className="text-xs font-mono tracking-widest text-randere-muted uppercase pb-2 border-b border-randere-border">
                ORDER BREAKDOWN
              </h3>

              <div className="divide-y divide-randere-border/60 max-h-72 overflow-y-auto space-y-3">
                {items.map((i) => (
                  <div key={i.id} className="pt-3 first:pt-0 flex items-center gap-3">
                    <img
                      src={i.imageUrl || '/placeholder.jpg'}
                      alt={i.name}
                      className="w-12 h-14 object-cover bg-neutral-900 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-white uppercase truncate">
                        {i.name}
                      </h5>
                      <span className="text-[10px] font-mono text-randere-muted uppercase">
                        QTY: {i.quantity} // SIZE: {i.size}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-white">
                      {formatKES(i.price * i.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-randere-border pt-4 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-neutral-400">
                  <span>SUBTOTAL</span>
                  <span className="text-white font-bold">{formatKES(cart?.subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>SHIPPING (KENYA)</span>
                  <span className="text-randere-accent">
                    {cart?.shippingFee === 0 ? 'FREE' : formatKES(cart?.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base text-white font-bold pt-2 border-t border-randere-border">
                  <span>TOTAL DUE (KES)</span>
                  <span className="text-randere-chalk">{formatKES(cart?.total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-randere-chalk text-black py-4 text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-randere-accent transition-colors shadow-2xl disabled:opacity-50"
              >
                {submitting ? 'RESERVING & PROCESSING...' : 'CONFIRM & AUTHORIZE ORDER'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="p-3 bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-randere-accent flex-shrink-0" />
                <span>ATOMIC ONE-OF-ONE RESERVATION GUARANTEE</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
