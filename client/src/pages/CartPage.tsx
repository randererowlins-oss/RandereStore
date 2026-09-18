import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShieldCheck, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../hooks/useCart.js';
import { formatKES } from '../lib/utils.js';
import { EmptyState } from '../components/EmptyState.js';

export const CartPage: React.FC = () => {
  const { cart, removeItem, updateQuantity, clearCart, loading } = useCart();
  const navigate = useNavigate();

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          title="YOUR BAG IS EMPTY."
          description="You haven't plugged any circular drops into your archive yet. Explore our newest releases."
          actionText="EXPLORE ARCHIVE"
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex items-center justify-between pb-6 border-b border-randere-border">
        <div>
          <span className="text-xs font-mono tracking-mega text-randere-accent uppercase block mb-1">
            [ BAG ARCHIVE ]
          </span>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white font-sans">
            SHOPPING BAG ({items.reduce((acc, i) => acc + i.quantity, 0)})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-mono text-neutral-400 hover:text-red-400 transition-colors uppercase tracking-wider"
        >
          CLEAR BAG
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Items List */}
        <div className="lg:col-span-8 divide-y divide-randere-border">
          {items.map((item) => (
            <div key={item.id} className="py-6 flex gap-6 first:pt-0">
              <Link
                to={`/shop/${item.slug}`}
                className="w-24 sm:w-32 aspect-[3/4] bg-neutral-900 overflow-hidden flex-shrink-0 border border-randere-border"
              >
                <img
                  src={item.imageUrl || '/placeholder.jpg'}
                  alt={item.name}
                  className="w-full h-full object-cover object-center"
                />
              </Link>

              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-4">
                    <Link
                      to={`/shop/${item.slug}`}
                      className="text-base font-bold text-white hover:text-randere-accent transition-colors"
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-randere-muted">
                    <span>SIZE: {item.size}</span>
                    {item.oneOfOne && (
                      <span className="text-randere-accent font-semibold">[1 OF 1 ORIGINAL]</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <span className="text-base font-mono font-bold text-white">
                    {formatKES(item.price)}
                  </span>

                  {item.oneOfOne ? (
                    <span className="text-xs font-mono text-neutral-400 border border-neutral-800 px-3 py-1">
                      QTY: 1 (UNIQUE)
                    </span>
                  ) : (
                    <div className="flex items-center border border-randere-border">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-3 py-1 text-sm text-neutral-400 hover:text-white"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-mono text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-3 py-1 text-sm text-neutral-400 hover:text-white"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="pt-6">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs font-mono text-randere-muted hover:text-white uppercase tracking-widest transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              CONTINUE BROWSING DROPS
            </Link>
          </div>
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="lg:col-span-4">
          <div className="p-6 bg-randere-card/50 border border-randere-border space-y-6 sticky top-24">
            <h3 className="text-xs font-mono tracking-widest text-randere-muted uppercase pb-3 border-b border-randere-border">
              ORDER SUMMARY
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between text-randere-muted">
                <span>SUBTOTAL</span>
                <span className="text-white font-bold">{formatKES(cart?.subtotal)}</span>
              </div>
              <div className="flex justify-between text-randere-muted">
                <span>KENYA DISPATCH</span>
                <span className="text-randere-accent">
                  {cart?.shippingFee === 0 ? 'FREE' : formatKES(cart?.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-base text-white font-bold pt-3 border-t border-randere-border">
                <span>ESTIMATED TOTAL</span>
                <span className="text-randere-chalk">{formatKES(cart?.total)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-randere-chalk text-black py-4 text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-randere-accent transition-colors shadow-2xl"
            >
              PROCEED TO CHECKOUT
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="p-3 bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-randere-accent flex-shrink-0" />
              <span>SERVER-VERIFIED STOCK // ONE-OF-ONE PROTECTION ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
