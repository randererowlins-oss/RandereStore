import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/index.js';
import { formatKES } from '../lib/utils.js';
import { ScarcityBadge } from './ScarcityBadge.js';
import { useCart } from '../hooks/useCart.js';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem, loading } = useCart();
  const [adding, setAdding] = useState(false);

  const primaryImage = product.images?.find((img) => img.isPrimary)?.url || product.images?.[0]?.url || '/placeholder.jpg';
  const secondaryImage = product.images?.[1]?.url || primaryImage;

  const isSoldOut = product.status === 'SOLD' || product.stock_quantity <= 0;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut || adding || loading) return;

    try {
      setAdding(true);
      await addItem(product.id, 1);
    } catch (err) {
      console.error('Failed to add item to bag', err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      className="group relative flex flex-col bg-randere-dark/60 border border-randere-border hover:border-neutral-500 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Canvas */}
      <Link to={`/shop/${product.slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900 block">
        <img
          src={isHovered && secondaryImage ? secondaryImage : primaryImage}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Scarcity Badge */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          <ScarcityBadge
            status={product.status}
            oneOfOne={product.one_of_one}
            stockQuantity={product.stock_quantity}
          />
        </div>

        {/* Quick Add Overlay on hover for desktop */}
        {!isSoldOut && (
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden md:flex justify-end">
            <button
              onClick={handleQuickAdd}
              disabled={adding}
              className="flex items-center gap-2 bg-randere-chalk text-black px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase hover:bg-randere-accent transition-colors shadow-lg"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {adding ? 'ADDING...' : 'ADD TO BAG'}
            </button>
          </div>
        )}
      </Link>

      {/* Editorial Garment Metadata */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-randere-muted mb-1">
            <span className="uppercase tracking-wider">{product.product_type}</span>
            <span className="text-randere-bone font-medium">SIZE {product.size}</span>
          </div>

          <Link to={`/shop/${product.slug}`}>
            <h3 className="text-sm font-semibold tracking-tight text-randere-chalk hover:text-randere-accent transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-randere-border/60">
          <span className="text-sm font-bold tracking-tight text-white font-mono">
            {formatKES(product.price)}
          </span>

          <Link
            to={`/shop/${product.slug}`}
            className="text-[11px] font-mono tracking-widest text-randere-muted uppercase hover:text-white transition-colors"
          >
            VIEW PIECE &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
