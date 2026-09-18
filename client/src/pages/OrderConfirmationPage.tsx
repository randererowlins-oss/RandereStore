import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, ArrowRight, Package, Smartphone } from 'lucide-react';
import { api } from '../lib/api.js';
import { Order } from '../types/index.js';
import { formatKES } from '../lib/utils.js';

export const OrderConfirmationPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>((location.state as any)?.order || null);
  const [payment, setPayment] = useState<any>((location.state as any)?.payment || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && orderNumber) {
      api.get(`/orders/track/${orderNumber}`)
        .then((res) => {
          if (res.success && res.data) setOrder(res.data);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [orderNumber, order]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center font-mono text-xs text-randere-muted animate-pulse">
        GENERATING ARCHIVE CONFIRMATION...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold uppercase text-white font-sans">
          ORDER NOT LOCATED
        </h2>
        <Link
          to="/shop"
          className="inline-block bg-randere-chalk text-black px-6 py-2.5 text-xs font-mono uppercase font-bold"
        >
          RETURN TO ARCHIVE
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      {/* Success Badge */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-neutral-900 border border-randere-accent text-randere-accent flex items-center justify-center mx-auto shadow-2xl">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-xs font-mono tracking-mega text-randere-accent uppercase block">
          [ TRANSACTION REGISTERED ]
        </span>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white font-sans">
          ORDER CONFIRMED.
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-md mx-auto">
          Your circular drop has been locked down in the RANDERE studio dispatch register.
        </p>
      </div>

      {/* M-PESA Instruction Alert if applicable */}
      {order.payment_method === 'MPESA' && payment?.instructions && (
        <div className="p-6 bg-neutral-950 border-2 border-randere-accent/60 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-randere-accent uppercase">
            <Smartphone className="w-4 h-4" />
            <span>M-PESA PAYMENT DISPATCH</span>
          </div>
          <p className="text-xs font-mono text-neutral-200 leading-relaxed">
            {payment.instructions}
          </p>
          <p className="text-[11px] font-mono text-neutral-400">
            CHECKOUT REFERENCE: <strong className="text-white">{payment.transactionId || order.payment_reference || 'STK_DISPATCHED'}</strong>
          </p>
        </div>
      )}

      {/* Order Spec Sheet */}
      <div className="p-8 bg-randere-card/50 border border-randere-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-randere-border gap-2 text-xs font-mono">
          <div>
            <span className="text-neutral-500 block">ORDER IDENTIFIER:</span>
            <span className="text-base font-bold text-randere-accent">{order.order_number}</span>
          </div>

          <div className="sm:text-right">
            <span className="text-neutral-500 block">STATUS:</span>
            <span className="px-2.5 py-1 text-[10px] font-mono uppercase bg-neutral-900 border border-neutral-700 text-white font-bold inline-block mt-0.5">
              PAYMENT: {order.payment_status} // FULFILLMENT: {order.fulfillment_status}
            </span>
          </div>
        </div>

        {/* Itemised list */}
        <div className="divide-y divide-randere-border/60">
          {order.items?.map((item) => (
            <div key={item.id} className="py-4 first:pt-0 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.productName} className="w-12 h-14 object-cover bg-neutral-900 border border-neutral-800" />
                )}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">{item.productName}</h4>
                  <span className="text-[11px] font-mono text-neutral-400">
                    SIZE: {item.size} // QTY: {item.quantity}
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-white">
                {formatKES(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Financial Summary */}
        <div className="border-t border-randere-border pt-4 space-y-2 text-xs font-mono">
          <div className="flex justify-between text-neutral-400">
            <span>SUBTOTAL</span>
            <span className="text-white font-bold">{formatKES(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>KENYA DISPATCH FEE</span>
            <span className="text-randere-accent">
              {order.shipping_fee === 0 ? 'FREE' : formatKES(order.shipping_fee)}
            </span>
          </div>
          <div className="flex justify-between text-sm text-white font-bold pt-2 border-t border-randere-border">
            <span>TOTAL SETTLEMENT (KES)</span>
            <span className="text-randere-chalk">{formatKES(order.total)}</span>
          </div>
        </div>

        {/* Destination */}
        <div className="border-t border-randere-border pt-4 text-xs font-mono text-neutral-400">
          <span className="text-neutral-500 uppercase block mb-1">DISPATCH DESTINATION:</span>
          <p className="text-white font-medium">
            {order.customer_name} ({order.customer_phone})
          </p>
          <p>
            {order.shipping_address?.streetAddress}, {order.shipping_address?.estate ? `${order.shipping_address.estate}, ` : ''}{order.shipping_address?.city}, Kenya
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to="/shop"
          className="w-full sm:w-auto text-center bg-randere-chalk text-black px-8 py-3.5 text-xs font-mono font-bold uppercase tracking-widest hover:bg-randere-accent transition-colors"
        >
          CONTINUE TO ARCHIVE
        </Link>
        <Link
          to="/account"
          className="w-full sm:w-auto text-center border border-randere-border text-white px-8 py-3.5 text-xs font-mono uppercase tracking-widest hover:border-neutral-500 transition-colors"
        >
          VIEW MY ORDERS
        </Link>
      </div>
    </div>
  );
};
