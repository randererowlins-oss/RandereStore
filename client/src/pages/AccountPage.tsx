import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { api } from '../lib/api.js';
import { Order, CustomRequest, StylingRequest } from '../types/index.js';
import { formatKES, formatDate } from '../lib/utils.js';
import { Package, Scissors, Sparkles, User, LogOut, ArrowRight, ShieldCheck } from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'custom' | 'styling' | 'profile'>('orders');

  const [orders, setOrders] = useState<Order[]>([]);
  const [customRequests, setCustomRequests] = useState<CustomRequest[]>([]);
  const [stylingRequests, setStylingRequests] = useState<StylingRequest[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      loadAccountData();
    }
  }, [user, authLoading, navigate]);

  const loadAccountData = async () => {
    try {
      setLoadingData(true);
      const [ordersRes, customRes, stylingRes] = await Promise.all([
        api.get('/orders/my'),
        api.get('/custom-requests/my'),
        api.get('/styling-requests/my'),
      ]);

      if (ordersRes.success) setOrders(ordersRes.data || []);
      if (customRes.success) setCustomRequests(customRes.data || []);
      if (stylingRes.success) setStylingRequests(stylingRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (authLoading || (!user && loadingData)) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center font-mono text-xs text-randere-muted animate-pulse">
        LOADING CLIENT DOSSIER...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Account Hero Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-randere-border gap-4">
        <div>
          <span className="text-xs font-mono tracking-mega text-randere-accent uppercase block mb-1">
            [ VERIFIED CLIENT ARCHIVE ]
          </span>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white font-sans">
            {user?.fullName}
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            {user?.email} {user?.phone && `// ${user.phone}`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              className="bg-randere-accent text-black px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider"
            >
              ADMIN PORTAL
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 border border-randere-border px-4 py-2 text-xs font-mono text-neutral-400 hover:text-red-400 hover:border-red-400 transition-colors uppercase"
          >
            <LogOut className="w-3.5 h-3.5" />
            SIGN OUT
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-randere-border pb-px overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-mono uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-randere-accent text-randere-accent font-bold'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          ORDERS ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-mono uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'custom'
              ? 'border-randere-accent text-randere-accent font-bold'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Scissors className="w-4 h-4" />
          CUSTOM REWORKS ({customRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('styling')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-mono uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'styling'
              ? 'border-randere-accent text-randere-accent font-bold'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          STYLING BRIEFS ({stylingRequests.length})
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {/* 1. Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="py-16 text-center border border-randere-border bg-randere-card/30">
                <p className="text-xs font-mono text-neutral-400 uppercase mb-4">
                  YOU HAVEN'T PLACED ANY ORDERS YET.
                </p>
                <Link
                  to="/shop"
                  className="bg-randere-chalk text-black px-6 py-2.5 text-xs font-mono font-bold uppercase hover:bg-randere-accent"
                >
                  BROWSE CURRENT DROP
                </Link>
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-6 bg-randere-card/40 border border-randere-border space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-randere-border text-xs font-mono gap-2">
                    <div>
                      <span className="text-neutral-500">ORDER NO:</span>{' '}
                      <strong className="text-randere-accent">{ord.order_number}</strong>
                      <span className="text-neutral-500 ml-3">PLACED:</span>{' '}
                      <span className="text-white">{formatDate(ord.created_at)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-neutral-900 border border-neutral-700 text-neutral-300">
                        PAYMENT: {ord.payment_status}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-neutral-900 border border-neutral-700 text-randere-accent">
                        STATUS: {ord.fulfillment_status}
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-randere-border/40">
                    {ord.items?.map((item) => (
                      <div key={item.id} className="py-3 first:pt-0 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {item.imageUrl && (
                            <img src={item.imageUrl} alt={item.productName} className="w-10 h-12 object-cover bg-neutral-900" />
                          )}
                          <div>
                            <h5 className="text-xs font-bold text-white uppercase">{item.productName}</h5>
                            <span className="text-[10px] font-mono text-neutral-400">
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

                  <div className="pt-2 flex items-center justify-between text-xs font-mono border-t border-randere-border/60">
                    <span className="text-neutral-400">TOTAL PAID / DUE:</span>
                    <span className="text-sm font-bold text-white">{formatKES(ord.total)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 2. Custom Rework Requests Tab */}
        {activeTab === 'custom' && (
          <div className="space-y-6">
            {customRequests.length === 0 ? (
              <div className="py-16 text-center border border-randere-border bg-randere-card/30">
                <p className="text-xs font-mono text-neutral-400 uppercase mb-4">
                  NO ACTIVE CUSTOM TRANSFORMATION REQUESTS.
                </p>
                <Link
                  to="/custom"
                  className="bg-randere-chalk text-black px-6 py-2.5 text-xs font-mono font-bold uppercase hover:bg-randere-accent"
                >
                  START A CUSTOM REWORK
                </Link>
              </div>
            ) : (
              customRequests.map((req) => (
                <div key={req.id} className="p-6 bg-randere-card/40 border border-randere-border space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-randere-border text-xs font-mono">
                    <span className="text-randere-accent font-bold uppercase">
                      {req.garmentType}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] uppercase bg-neutral-900 border border-neutral-700 text-white font-bold">
                      STATUS: {req.status}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 font-light leading-relaxed">
                    "{req.description}"
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">SERVICES:</span>
                    {req.serviceTypes?.map((s) => (
                      <span key={s} className="px-2 py-0.5 text-[10px] font-mono uppercase bg-neutral-900 border border-neutral-800 text-neutral-300">
                        {s}
                      </span>
                    ))}
                  </div>

                  {req.quoteAmount && (
                    <div className="p-3 bg-neutral-900 border border-randere-accent/60 text-xs font-mono text-randere-accent flex justify-between items-center">
                      <span>STUDIO QUOTE: {formatKES(req.quoteAmount)}</span>
                      {req.adminNotes && <span className="text-neutral-300">NOTE: {req.adminNotes}</span>}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* 3. Styling Requests Tab */}
        {activeTab === 'styling' && (
          <div className="space-y-6">
            {stylingRequests.length === 0 ? (
              <div className="py-16 text-center border border-randere-border bg-randere-card/30">
                <p className="text-xs font-mono text-neutral-400 uppercase mb-4">
                  NO STYLING CONSULTATIONS SUBMITTED.
                </p>
                <Link
                  to="/style"
                  className="bg-randere-accent text-black px-6 py-2.5 text-xs font-mono font-bold uppercase hover:bg-white"
                >
                  GET PLUGGED (INTAKE)
                </Link>
              </div>
            ) : (
              stylingRequests.map((st) => (
                <div key={st.id} className="p-6 bg-randere-card/40 border border-randere-border space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-randere-border text-xs font-mono">
                    <span className="text-randere-accent font-bold uppercase">
                      OCCASION: {st.occasion}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] uppercase bg-neutral-900 border border-neutral-700 text-white font-bold">
                      STATUS: {st.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono text-neutral-400">
                    <div>
                      <span className="text-neutral-500 block">AESTHETIC:</span>
                      <span className="text-neutral-200">{st.preferredAesthetic}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">SIZE:</span>
                      <span className="text-neutral-200">{st.size} ({st.presentationPreference})</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">BUDGET:</span>
                      <span className="text-neutral-200">{st.budget ? formatKES(st.budget) : 'Flexible'}</span>
                    </div>
                  </div>

                  {st.additionalNotes && (
                    <p className="text-xs text-neutral-400 italic pt-1">
                      "{st.additionalNotes}"
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
