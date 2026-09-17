import React, { useState, useEffect } from 'react';
import { Package, Check, RefreshCw, Phone, MapPin } from 'lucide-react';
import { api } from '../lib/api.js';
import { Order } from '../types/index.js';
import { formatKES, formatDate } from '../lib/utils.js';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders?limit=50');
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (
    orderId: string,
    updates: { paymentStatus?: any; fulfillmentStatus?: any }
  ) => {
    try {
      await api.patch(`/orders/${orderId}/status`, updates);
      await loadOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 text-xs font-mono">
      <div className="flex items-center justify-between pb-6 border-b border-randere-border">
        <div>
          <span className="text-xs font-mono tracking-mega text-randere-accent uppercase block mb-1">
            [ FULFILLMENT &amp; LOGISTICS ]
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
            CUSTOMER ORDERS ({orders.length})
          </h1>
        </div>

        <button
          onClick={loadOrders}
          className="flex items-center gap-1.5 border border-randere-border px-3 py-2 text-neutral-300 hover:text-white"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          REFRESH
        </button>
      </div>

      <div className="space-y-6">
        {orders.map((ord) => (
          <div
            key={ord.id}
            className="p-6 bg-[#111114] border border-randere-border space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-randere-border gap-2">
              <div>
                <span className="text-neutral-500">ORDER NO:</span>{' '}
                <strong className="text-randere-accent text-sm">{ord.order_number}</strong>
                <span className="text-neutral-500 ml-3">DATE:</span>{' '}
                <span className="text-white">{formatDate(ord.created_at)}</span>
              </div>

              {/* Status Selectors */}
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-neutral-500 mr-2 text-[10px]">PAYMENT:</span>
                  <select
                    value={ord.payment_status}
                    onChange={(e) =>
                      handleUpdateStatus(ord.id, { paymentStatus: e.target.value })
                    }
                    className="bg-neutral-900 border border-neutral-700 p-1 text-white uppercase text-[10px]"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="FAILED">FAILED</option>
                    <option value="REFUNDED">REFUNDED</option>
                  </select>
                </div>

                <div>
                  <span className="text-neutral-500 mr-2 text-[10px]">FULFILLMENT:</span>
                  <select
                    value={ord.fulfillment_status}
                    onChange={(e) =>
                      handleUpdateStatus(ord.id, { fulfillmentStatus: e.target.value })
                    }
                    className="bg-neutral-900 border border-neutral-700 p-1 text-randere-accent uppercase text-[10px]"
                  >
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="READY">READY FOR DISPATCH</option>
                    <option value="SHIPPED">DISPATCHED (IN TRANSIT)</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Client & Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-neutral-300 py-2 border-b border-randere-border/60">
              <div className="space-y-1">
                <span className="text-neutral-500 block text-[10px] uppercase">
                  CUSTOMER:
                </span>
                <p className="text-white font-bold">{ord.customer_name}</p>
                <p className="flex items-center gap-1.5 text-neutral-400">
                  <Phone className="w-3 h-3 text-randere-accent" />
                  {ord.customer_phone} ({ord.customer_email})
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-neutral-500 block text-[10px] uppercase">
                  DISPATCH ADDRESS:
                </span>
                <p className="flex items-start gap-1.5 text-neutral-300">
                  <MapPin className="w-3.5 h-3.5 text-randere-accent mt-0.5 flex-shrink-0" />
                  <span>
                    {ord.shipping_address?.streetAddress},{' '}
                    {ord.shipping_address?.estate ? `${ord.shipping_address.estate}, ` : ''}
                    {ord.shipping_address?.city}, Kenya
                  </span>
                </p>
                {ord.delivery_notes && (
                  <p className="text-[11px] text-neutral-400 italic">
                    Note: "{ord.delivery_notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Ordered Items */}
            <div className="divide-y divide-randere-border/40">
              {ord.items?.map((item) => (
                <div key={item.id} className="py-2.5 first:pt-0 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-8 h-10 object-cover bg-neutral-900"
                      />
                    )}
                    <div>
                      <span className="font-bold text-white uppercase block">
                        {item.productName}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        SIZE: {item.size} // QTY: {item.quantity} // TYPE: {item.productType}
                      </span>
                    </div>
                  </div>
                  <span className="text-white font-bold">
                    {formatKES(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 text-xs border-t border-randere-border">
              <span className="text-neutral-500">
                METHOD: <strong className="text-white">{ord.payment_method}</strong> // REF:{' '}
                {ord.payment_reference || 'N/A'}
              </span>
              <span className="text-sm font-bold text-white">
                TOTAL: {formatKES(ord.total)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
