import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { api } from '../lib/api.js';
import { Product } from '../types/index.js';
import { formatKES } from '../lib/utils.js';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const trendingTags = ['Hand-Painted', 'Denim', 'Trucker', 'Remade', 'Chore', 'Poplin', 'Wide Leg'];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products?search=${encodeURIComponent(query)}&limit=6`);
        if (res.success && res.data) {
          setResults(res.data);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (slug: string) => {
    onClose();
    navigate(`/shop/${slug}`);
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

      <div className="relative max-w-3xl mx-auto mt-16 px-4 z-10">
        <div className="bg-randere-dark border border-randere-border p-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-randere-border">
            <span className="text-xs font-mono uppercase tracking-mega text-randere-accent">
              [ GLOBAL ARCHIVE SEARCH ]
            </span>
            <button onClick={onClose} className="text-randere-muted hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative mt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              ref={inputRef}
              type="text"
              placeholder="SEARCH BY SILHOUETTE, FABRIC, REWORK TECHNIQUE..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-randere-accent font-mono"
            />
          </form>

          {/* Quick tags */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-2">
            <span className="text-[11px] font-mono text-randere-muted uppercase mr-1">
              TRENDING:
            </span>
            {trendingTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className="px-2.5 py-1 text-[11px] font-mono uppercase bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 hover:border-neutral-600 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search Results Preview */}
          <div className="mt-6 divide-y divide-randere-border/60 max-h-[50vh] overflow-y-auto">
            {loading && (
              <div className="py-8 text-center text-xs font-mono text-randere-muted animate-pulse">
                SCANNING ARCHIVE...
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="space-y-2 py-2">
                {results.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item.slug)}
                    className="flex items-center gap-4 p-2.5 hover:bg-neutral-900/80 cursor-pointer transition-colors border border-transparent hover:border-randere-border"
                  >
                    <img
                      src={item.images?.[0]?.url || '/placeholder.jpg'}
                      alt={item.name}
                      className="w-12 h-14 object-cover bg-neutral-800"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-white uppercase truncate">
                        {item.name}
                      </h5>
                      <span className="text-[11px] font-mono text-randere-muted uppercase">
                        {item.product_type} // SIZE {item.size}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-white">
                        {formatKES(item.price)}
                      </span>
                      {item.one_of_one && (
                        <span className="block text-[9px] font-mono text-randere-accent uppercase">
                          [1 OF 1]
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleSearchSubmit}
                  className="w-full mt-3 py-2 text-center text-xs font-mono tracking-widest text-randere-accent uppercase hover:underline flex items-center justify-center gap-1"
                >
                  VIEW ALL RESULTS IN SHOP <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {!loading && query && results.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-xs font-mono text-randere-muted uppercase">
                  NO PIECES FOUND MATCHING "{query}"
                </p>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Try searching for denim, chore coat, remade, or poplin
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
