import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { useCart } from '../hooks/useCart.js';
import { MobileMenu } from './MobileMenu.js';
import { SearchModal } from './SearchModal.js';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const { openBag, cart } = useCart();
  const navigate = useNavigate();

  const navItems = [
    { name: 'SHOP', path: '/shop' },
    { name: 'REMADE', path: '/shop?category=remade' },
    { name: 'CUSTOM', path: '/custom' },
    { name: 'STYLE', path: '/style' },
    { name: 'TRANSFORMATIONS', path: '/transformations' },
    { name: 'STORIES', path: '/stories' },
    { name: 'ABOUT', path: '/about' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0A0A0B]/90 backdrop-blur-md border-b border-randere-border">
        {/* Subtle drop ticker bar */}
        <div className="bg-neutral-900 border-b border-randere-border/50 text-center py-1 text-[10px] font-mono tracking-widest text-randere-muted uppercase flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 bg-randere-accent rounded-full animate-pulse inline-block" />
          <span>DROP ARCHIVE LIVE // WORLDWIDE SHIPPING &amp; NAIROBI SAME-DAY DISPATCH</span>
        </div>

        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-randere-chalk hover:text-randere-accent transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Master Brand Identity */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-bold tracking-mega uppercase text-randere-chalk font-sans hover:text-randere-accent transition-colors">
                RANDERE
              </span>
              <span className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.5 border border-neutral-700 text-neutral-400">
                STUDIO
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `text-xs font-mono font-medium tracking-widest uppercase transition-colors hover:text-randere-accent ${
                    isActive ? 'text-randere-accent border-b border-randere-accent pb-1' : 'text-randere-muted'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4 md:space-x-6">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-randere-chalk hover:text-randere-accent transition-colors p-1"
              title="Search Archive"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Account / Admin Portal */}
            {user ? (
              <div className="relative group">
                <Link
                  to={isAdmin ? '/admin' : '/account'}
                  className="flex items-center gap-1 text-xs font-mono tracking-wider uppercase text-randere-chalk hover:text-randere-accent transition-colors p-1"
                >
                  {isAdmin ? (
                    <Shield className="w-4 h-4 text-randere-accent" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span className="hidden md:inline text-[11px]">
                    {isAdmin ? 'ADMIN' : user.fullName.split(' ')[0]}
                  </span>
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-xs font-mono tracking-wider uppercase text-randere-chalk hover:text-randere-accent transition-colors p-1 flex items-center gap-1"
                title="Customer Sign In"
              >
                <User className="w-4 h-4" />
                <span className="hidden md:inline text-[11px]">SIGN IN</span>
              </Link>
            )}

            {/* Bag Drawer Trigger */}
            <button
              onClick={openBag}
              className="relative flex items-center gap-1.5 bg-randere-card hover:bg-neutral-800 text-randere-chalk px-3 py-1.5 border border-randere-border text-xs font-mono transition-colors"
              title="Open Bag"
            >
              <ShoppingBag className="w-4 h-4 text-randere-accent" />
              <span className="hidden sm:inline text-[11px] font-bold tracking-wider">BAG</span>
              <span className="font-bold text-white text-[11px]">
                ({cart?.itemCount || 0})
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Slide-out Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Fullscreen Mobile Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
    </>
  );
};
