import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useCart } from '../hooks/useCart.js';
import { formatKES } from '../lib/utils.js';

export const BagDrawer: React.FC = () => {
  const { cart, isBagOpen, closeBag, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();

  if (!isBagOpen) return null;

  const handleCheckout = () => {
    closeBag();
    navigate('/checkout');
  };

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={closeBag}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-randere-dark border-l border-randere-border text-randere-chalk flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-randere-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-mega text-randere-accent">
                [ BAG ARCHIVE ]
              </span>
              <span className="text-xs font-mono text-randere-muted">
                ({items.reduce((acc, i) => acc + i.quantity, 0)} ITEMS)
              </span>
            </div>
            <button
              onClick={closeBag}
              className="p-1 text-randere-muted hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bag Items list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isEmpty ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <ShoppingBag className="w-12 h-12 text-neutral-700 mb-4 stroke-1" />
                <h4 className="text-lg font-bold uppercase tracking-tight text-white mb-2">
                  YOUR BAG IS EMPTY.
                </h4>
                <p className="text-xs text-randere-muted max-w-xs mb-6 font-light">
                  You haven't plugged any circular drops into your archive yet.
                </p>
                <button
                  onClick={() => {
                    closeBag();
                    navigate('/shop');
                  }}
                  className="bg-randere-chalk text-black px-6 py-2.5 text-xs font-mono font-bold tracking-wider uppercase hover:bg-randere-accent transition-colors"
                >
                  BROWSE THE DROP
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-6 border-b border-randere-border/60 last:border-0"
                >
                  <Link
                    to={`/shop/${item.slug}`}
                    onClick={closeBag}
                    className="w-20 h-24 bg-neutral-900 overflow-hidden flex-shrink-0 border border-randere-border"
                  >
                    <img
                      src={item.imageUrl || '/placeholder.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/shop/${item.slug}`}
                          onClick={closeBag}
                          className="text-xs font-bold tracking-tight text-white hover:text-randere-accent transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-neutral-500 hover:text-red-400 transition-colors p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-randere-muted">
                        <span>SIZE: {item.size}</span>
                        {item.oneOfOne && (
                          <span className="text-randere-accent font-semibold">[1 OF 1]</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-mono font-bold text-white">
                        {formatKES(item.price)}
                      </span>

                      {item.oneOfOne ? (
                        <span className="text-[10px] font-mono text-neutral-400 border border-neutral-800 px-2 py-0.5">
                          QTY: 1 (UNIQUE)
                        </span>
                      ) : (
                        <div className="flex items-center border border-randere-border">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-neutral-400 hover:text-white"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-mono text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-neutral-400 hover:text-white"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {!isEmpty && (
            <div className="p-6 border-t border-randere-border bg-randere-card/40 space-y-4">
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-randere-muted">
                  <span>SUBTOTAL</span>
                  <span className="text-white font-bold">{formatKES(cart?.subtotal)}</span>
                </div>
                <div className="flex justify-between text-randere-muted">
                  <span>ESTIMATED DELIVERY</span>
                  <span className="text-randere-accent">
                    {cart?.shippingFee === 0 ? 'FREE (DROP COMPLIMENTARY)' : formatKES(cart?.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-white font-bold pt-2 border-t border-randere-border/80">
                  <span>TOTAL (KES)</span>
                  <span className="text-randere-chalk">{formatKES(cart?.total)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono text-randere-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-randere-accent" />
                <span>M-PESA EXPRESS & CARD READY // KENYA DIRECT DISPATCH</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-randere-chalk text-black py-3.5 px-4 text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-randere-accent transition-colors"
              >
                PROCEED TO CHECKOUT
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
