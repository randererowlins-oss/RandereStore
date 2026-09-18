import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#09090A] border-t border-randere-border text-randere-chalk pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-randere-border/60">
          {/* Brand Manifesto Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="text-2xl font-bold tracking-mega uppercase font-sans">
              RANDERE
            </Link>
            <p className="text-xs font-mono text-randere-muted leading-relaxed max-w-sm uppercase">
              CIRCULAR FASHION // CREATIVE REWORK // INDIVIDUAL IDENTITY.
            </p>
            <p className="text-sm text-neutral-400 font-light leading-relaxed max-w-sm">
              We find overlooked secondhand garments and engineer new value through curation, reconstruction, hand-painted art, and bespoke styling.
            </p>
            <div className="pt-2 text-xs font-mono text-randere-accent">
              «"WHERE DID YOU GET THAT?"» // «"WHO PLUGGED YOU?"»
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono tracking-widest text-randere-muted uppercase">
              ARCHIVE
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <Link to="/shop" className="text-neutral-300 hover:text-randere-accent transition-colors">
                  ALL DROPS
                </Link>
              </li>
              <li>
                <Link to="/shop?category=curated" className="text-neutral-300 hover:text-randere-accent transition-colors">
                  CURATED ARCHIVE
                </Link>
              </li>
              <li>
                <Link to="/shop?category=remade" className="text-neutral-300 hover:text-randere-accent transition-colors">
                  REMADE PIECES
                </Link>
              </li>
              <li>
                <Link to="/shop?category=arted" className="text-neutral-300 hover:text-randere-accent transition-colors">
                  WEARABLE ART
                </Link>
              </li>
              <li>
                <Link to="/transformations" className="text-neutral-300 hover:text-randere-accent transition-colors">
                  BEFORE / AFTER DOCS
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono tracking-widest text-randere-muted uppercase">
              STUDIO SERVICES
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <Link to="/custom" className="text-neutral-300 hover:text-randere-accent transition-colors">
                  CUSTOM GARMENT REWORK
                </Link>
              </li>
              <li>
                <Link to="/style" className="text-neutral-300 hover:text-randere-accent transition-colors">
                  GET PLUGGED (STYLING)
                </Link>
              </li>
              <li>
                <Link to="/stories" className="text-neutral-300 hover:text-randere-accent transition-colors">
                  EDITORIAL JOURNAL
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-neutral-300 hover:text-randere-accent transition-colors">
                  THE RANDERE METHOD
                </Link>
              </li>
              <li>
                <Link to="/account" className="text-neutral-300 hover:text-randere-accent transition-colors">
                  CLIENT PORTAL
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Drop Alerts */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono tracking-widest text-randere-muted uppercase">
              DROP ALERTS
            </h4>
            <p className="text-xs text-neutral-400 font-light">
              One-of-one pieces sell out fast. Get direct notifications prior to public releases.
            </p>
            {subscribed ? (
              <div className="p-3 bg-neutral-900 border border-randere-accent text-xs font-mono text-randere-accent flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>PLUGGED IN. YOU WILL HEAR FIRST.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="YOUR EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-randere-border px-3 py-2 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-randere-accent"
                />
                <button
                  type="submit"
                  className="w-full bg-randere-chalk text-black py-2 px-3 text-xs font-mono font-bold uppercase tracking-wider hover:bg-randere-accent transition-colors"
                >
                  GET DROP NOTICES
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom credits */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-mono text-randere-muted gap-4">
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} RANDERE STUDIO. ALL RIGHTS RESERVED.</span>
            <span>NAIROBI, KENYA</span>
          </div>
          <div className="flex items-center gap-6">
            <span>KENYA COMMERCE / M-PESA &amp; CARD</span>
            <Link to="/about" className="hover:text-randere-chalk transition-colors">
              CIRCULAR MANIFESTO
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
