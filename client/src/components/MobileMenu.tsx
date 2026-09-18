import React from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowUpRight, User, ShoppingBag, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { useCart } from '../hooks/useCart.js';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

const navLinks = [
  { name: 'SHOP', href: '/shop', note: 'CURATED ARCHIVE' },
  { name: 'REMADE', href: '/shop?category=remade', note: 'STRUCTURAL REWORKS' },
  { name: 'CUSTOM', href: '/custom', note: 'BRING US YOUR GARMENT' },
  { name: 'STYLE', href: '/style', note: 'GET PLUGGED INTAKE' },
  { name: 'TRANSFORMATIONS', href: '/transformations', note: 'BEFORE / AFTER DOCS' },
  { name: 'STORIES', href: '/stories', note: 'EDITORIAL JOURNAL' },
  { name: 'ABOUT', href: '/about', note: 'MANIFESTO & METHOD' },
];

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onOpenSearch }) => {
  const { user, isAdmin } = useAuth();
  const { openBag, cart } = useCart();

  if (!isOpen) return null;

  const handleBagClick = () => {
    onClose();
    openBag();
  };

  const handleSearchClick = () => {
    onClose();
    onOpenSearch();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0B] text-randere-chalk flex flex-col justify-between overflow-y-auto px-6 py-8">
      {/* Top bar */}
      <div className="flex items-center justify-between pb-6 border-b border-randere-border">
        <Link to="/" onClick={onClose} className="text-xl font-bold tracking-mega uppercase font-sans">
          RANDERE
        </Link>
        <button
          onClick={onClose}
          className="p-2 border border-randere-border text-randere-muted hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav List */}
      <div className="py-8 space-y-6 flex-1">
        {navLinks.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            onClick={onClose}
            className="group flex items-baseline justify-between py-2 border-b border-randere-border/40 hover:border-randere-accent transition-colors"
          >
            <div>
              <span className="text-2xl md:text-3xl font-bold tracking-tight uppercase group-hover:text-randere-accent transition-colors font-sans">
                {item.name}
              </span>
              <span className="block text-[10px] font-mono text-randere-muted uppercase tracking-widest mt-0.5">
                {item.note}
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-randere-muted group-hover:text-randere-accent transition-colors" />
          </Link>
        ))}
      </div>

      {/* Bottom utility tray */}
      <div className="pt-6 border-t border-randere-border space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleSearchClick}
            className="flex flex-col items-center justify-center p-3 border border-randere-border hover:border-randere-accent text-xs font-mono uppercase text-randere-chalk"
          >
            <Search className="w-4 h-4 mb-1 text-randere-muted" />
            SEARCH
          </button>

          <Link
            to={user ? (isAdmin ? '/admin' : '/account') : '/login'}
            onClick={onClose}
            className="flex flex-col items-center justify-center p-3 border border-randere-border hover:border-randere-accent text-xs font-mono uppercase text-randere-chalk"
          >
            <User className="w-4 h-4 mb-1 text-randere-muted" />
            {user ? (isAdmin ? 'ADMIN' : 'ACCOUNT') : 'SIGN IN'}
          </Link>

          <button
            onClick={handleBagClick}
            className="flex flex-col items-center justify-center p-3 border border-randere-border hover:border-randere-accent text-xs font-mono uppercase text-randere-chalk relative"
          >
            <ShoppingBag className="w-4 h-4 mb-1 text-randere-muted" />
            BAG ({cart?.itemCount || 0})
          </button>
        </div>

        <div className="text-[11px] font-mono text-neutral-500 text-center pt-2">
          NAIROBI STUDIO // CIRCULAR FASHION ARCHIVE
        </div>
      </div>
    </div>
  );
};
