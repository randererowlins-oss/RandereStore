import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X, RefreshCw } from 'lucide-react';
import { ProductCard } from '../components/ProductCard.js';
import { EmptyState } from '../components/EmptyState.js';
import { api } from '../lib/api.js';
import { Product } from '../types/index.js';

const categoryTabs = [
  { name: 'ALL', value: 'all' },
  { name: 'CURATED', value: 'curated' },
  { name: 'REMADE', value: 'remade' },
  { name: 'ARTED', value: 'arted' },
  { name: 'ACCESSORIES', value: 'accessories' },
];

const sizeOptions = ['All Sizes', 'S', 'M', 'L', 'XL', '30', '32', 'OS'];

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Active query filters
  const currentCategory = searchParams.get('category') || 'all';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentSize = searchParams.get('size') || '';
  const currentOneOfOne = searchParams.get('oneOfOne') || '';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    async function loadCatalogue() {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();

        if (currentCategory && currentCategory !== 'all') {
          queryParams.set('category', currentCategory);
        }
        if (currentSort) {
          queryParams.set('sort', currentSort);
        }
        if (currentSize && currentSize !== 'All Sizes') {
          queryParams.set('size', currentSize);
        }
        if (currentOneOfOne === 'true') {
          queryParams.set('oneOfOne', 'true');
        }
        if (searchQuery) {
          queryParams.set('search', searchQuery);
        }

        const res = await api.get(`/products?${queryParams.toString()}`);
        if (res.success && res.data) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error('Failed to load catalogue:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCatalogue();
  }, [searchParams]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all' || value === 'All Sizes') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-randere-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-mega text-randere-accent uppercase block mb-1">
            [ RUNWAY // ARCHIVE DROPS ]
          </span>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white font-sans">
            COLLECTION ARCHIVE
          </h1>
          <p className="text-xs font-mono text-randere-muted uppercase mt-1">
            SHOWING {products.length} CURATED &amp; REWORKED PIECES
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className="md:hidden flex items-center gap-2 border border-randere-border px-3 py-2 text-xs font-mono text-randere-chalk"
          >
            <SlidersHorizontal className="w-4 h-4 text-randere-accent" />
            FILTERS
          </button>

          <select
            value={currentSort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="bg-neutral-900 border border-randere-border px-3 py-2 text-xs font-mono text-randere-chalk focus:outline-none focus:border-randere-accent"
          >
            <option value="newest">SORT: NEWEST RELEASES</option>
            <option value="price-asc">SORT: PRICE LOW &rarr; HIGH</option>
            <option value="price-desc">SORT: PRICE HIGH &rarr; LOW</option>
            <option value="featured">SORT: FEATURED HIGHLIGHTS</option>
          </select>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categoryTabs.map((cat) => (
          <button
            key={cat.value}
            onClick={() => updateParam('category', cat.value)}
            className={`px-4 py-2 text-xs font-mono font-medium uppercase tracking-wider border whitespace-nowrap transition-colors ${
              currentCategory.toLowerCase() === cat.value.toLowerCase()
                ? 'bg-randere-chalk text-black border-randere-chalk font-bold'
                : 'bg-neutral-900/60 text-neutral-400 border-randere-border hover:border-neutral-500 hover:text-white'
            }`}
          >
            {cat.name}
          </button>
        ))}

        <button
          onClick={() => updateParam('oneOfOne', currentOneOfOne === 'true' ? '' : 'true')}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border whitespace-nowrap transition-colors ${
            currentOneOfOne === 'true'
              ? 'bg-randere-accent text-black border-randere-accent font-bold'
              : 'bg-neutral-900/60 text-neutral-400 border-randere-border hover:border-randere-accent hover:text-randere-accent'
          }`}
        >
          ★ 1-OF-1 ORIGINALS ONLY
        </button>

        {/* Clear filters if any applied */}
        {(currentCategory !== 'all' || currentSize || currentOneOfOne || searchQuery) && (
          <button
            onClick={clearAllFilters}
            className="px-3 py-2 text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            RESET
          </button>
        )}
      </div>

      {/* Search status indicator */}
      {searchQuery && (
        <div className="p-3 bg-neutral-900 border border-randere-border text-xs font-mono flex items-center justify-between">
          <span>
            SEARCH RESULTS FOR: <strong className="text-randere-accent">"{searchQuery}"</strong>
          </span>
          <button onClick={() => updateParam('search', '')} className="text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[3/4] bg-neutral-900 border border-randere-border" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="NOTHING HERE YET."
          description="We couldn't find any archive pieces matching your selected filters. Reset filters to explore all drops."
          actionText="RESET FILTERS"
          onAction={clearAllFilters}
        />
      )}
    </div>
  );
};
