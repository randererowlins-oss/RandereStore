import React from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Scissors,
  Sparkles,
  BookOpen,
  ArrowLeftRight,
  LogOut,
  ExternalLink,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-mono text-red-500 uppercase tracking-widest mb-3">
          ACCESS RESTRICTED // 403
        </h2>
        <p className="text-sm text-neutral-400 max-w-sm mb-6">
          The studio operations dashboard requires verified ADMIN privileges.
        </p>
        <Link
          to="/login"
          className="bg-randere-chalk text-black px-6 py-2.5 text-xs font-mono uppercase font-bold hover:bg-randere-accent transition-colors"
        >
          SIGN IN AS ADMIN
        </Link>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products & Inventory', path: '/admin/products', icon: Package },
    { name: 'Customer Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Custom Requests', path: '/admin/custom-requests', icon: Scissors },
    { name: 'Styling Requests', path: '/admin/styling-requests', icon: Sparkles },
    { name: 'Editorial Stories', path: '/admin/stories', icon: BookOpen },
    { name: 'Transformations', path: '/admin/transformations', icon: ArrowLeftRight },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-[#0C0C0E] text-[#F4F4F2]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-randere-border bg-[#09090A] flex flex-col justify-between hidden md:flex">
        <div>
          <div className="p-6 border-b border-randere-border flex items-center justify-between">
            <Link to="/" className="text-lg font-bold tracking-mega uppercase font-sans">
              RANDERE
            </Link>
            <span className="text-[9px] font-mono bg-randere-accent text-black px-1.5 py-0.5 font-bold uppercase">
              OPS
            </span>
          </div>

          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                      isActive
                        ? 'bg-neutral-900 text-randere-accent border-l-2 border-randere-accent font-bold'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-randere-border space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-mono text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700"
          >
            <span>LIVE STOREFRONT</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono text-red-400 hover:text-red-300 hover:bg-red-950/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>TERMINATE SESSION</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-randere-border bg-[#0E0E10] px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-randere-muted uppercase tracking-widest">
              STUDIO MANAGEMENT // NAIROBI
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-randere-accent font-semibold">{user?.fullName}</span>
            <span className="text-neutral-500">({user?.email})</span>
          </div>
        </header>

        <main className="p-6 md:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
