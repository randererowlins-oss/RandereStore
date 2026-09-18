import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Scissors,
  Sparkles,
  Users,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { api } from '../lib/api.js';
import { formatKES } from '../lib/utils.js';

export const AdminDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        setLoading(true);
        const res = await api.get('/admin/metrics');
        if (res.success && res.data) {
          setMetrics(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center font-mono text-xs text-randere-muted animate-pulse">
        COMPILING STUDIO OPS METRICS...
      </div>
    );
  }

  const cards = [
    {
      title: 'TOTAL SALES (SETTLED)',
      value: formatKES(metrics?.totalSales || 0),
      icon: TrendingUp,
      accent: 'text-randere-accent',
      note: 'Verified M-Pesa & Card Settlements',
    },
    {
      title: 'TOTAL ORDERS',
      value: metrics?.totalOrders || 0,
      icon: ShoppingBag,
      accent: 'text-white',
      note: `${metrics?.pendingOrders || 0} Pending Fulfillment`,
    },
    {
      title: 'ARCHIVE PRODUCTS',
      value: metrics?.totalProducts || 0,
      icon: Package,
      accent: 'text-white',
      note: `${metrics?.soldProducts || 0} Marked Sold Out`,
    },
    {
      title: 'CUSTOM COMMISSIONS',
      value: metrics?.customRequests || 0,
      icon: Scissors,
      accent: 'text-randere-orange',
      note: 'Garment Resurrections',
    },
    {
      title: 'STYLING BRIEFS',
      value: metrics?.stylingRequests || 0,
      icon: Sparkles,
      accent: 'text-randere-accent',
      note: 'Personal Styling Consults',
    },
    {
      title: 'REGISTERED CLIENTS',
      value: metrics?.customerCount || 0,
      icon: Users,
      accent: 'text-white',
      note: 'Verified User Accounts',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-mono tracking-mega text-randere-accent uppercase block mb-1">
          [ REAL-TIME STUDIO TELEMETRY ]
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white font-sans">
          OPERATIONS OVERVIEW
        </h1>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              className="p-6 bg-randere-card/60 border border-randere-border space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>{c.title}</span>
                <Icon className={`w-4 h-4 ${c.accent}`} />
              </div>
              <div className={`text-3xl font-mono font-bold ${c.accent}`}>
                {c.value}
              </div>
              <p className="text-[11px] font-mono text-neutral-500 pt-1 border-t border-randere-border/60">
                {c.note}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Ops Shortcuts */}
      <div className="p-8 bg-[#101013] border border-randere-border space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-randere-muted">
          STUDIO DISPATCH &amp; CATALOGUE ACTIONS
        </h3>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/products"
            className="bg-randere-chalk text-black px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider hover:bg-randere-accent transition-colors flex items-center gap-2"
          >
            CREATE NEW GARMENT DROP
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/admin/orders"
            className="border border-neutral-700 text-white px-6 py-3 text-xs font-mono uppercase tracking-wider hover:border-randere-accent transition-colors"
          >
            PROCESS DISPATCH ORDERS
          </Link>

          <Link
            to="/admin/custom-requests"
            className="border border-neutral-700 text-white px-6 py-3 text-xs font-mono uppercase tracking-wider hover:border-randere-accent transition-colors"
          >
            REVIEW CLIENT REWORKS
          </Link>
        </div>
      </div>
    </div>
  );
};
