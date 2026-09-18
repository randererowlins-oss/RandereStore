import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, ShieldCheck, Sparkles, Check, Scissors } from 'lucide-react';
import { api } from '../lib/api.js';
import { Product } from '../types/index.js';
import { formatKES } from '../lib/utils.js';
import { ScarcityBadge } from '../components/ScarcityBadge.js';
import { useCart } from '../hooks/useCart.js';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem, loading: cartLoading } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/products/${slug}`);
        if (res.success && res.data) {
          setProduct(res.data);
          const primary = res.data.images?.find((img: any) => img.isPrimary)?.url || res.data.images?.[0]?.url;
          setSelectedImage(primary || '');
        }
      } catch (err: any) {
        setError(err.message || 'Garment not found');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-mono text-xs text-randere-muted animate-pulse">
        RETRIEVING ARCHIVE SPECIFICATIONS...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold uppercase text-white font-sans">
          PIECE NOT FOUND IN ARCHIVE
        </h2>
        <p className="text-xs font-mono text-neutral-400">
          This release may have expired, been unlisted, or sold out.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-randere-chalk text-black px-6 py-3 text-xs font-mono uppercase font-bold hover:bg-randere-accent transition-colors"
        >
          &larr; BACK TO RELEASES
        </Link>
      </div>
    );
  }

  const isSoldOut = product.status === 'SOLD' || product.stock_quantity <= 0;

  const handleAddToBag = async () => {
    if (isSoldOut || cartLoading) return;
    try {
      await addItem(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error('Failed to add item to bag:', err);
    }
  };

  const images = product.images || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-16">
      {/* Back button */}
      <div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-randere-muted hover:text-randere-accent uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          BACK TO ARCHIVE
        </Link>
      </div>

      {/* Main Editorial Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Gallery Column */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Selected Image */}
          <div className="relative aspect-[3/4] w-full bg-neutral-900 border border-randere-border overflow-hidden">
            <img
              src={selectedImage || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-4 left-4">
              <ScarcityBadge
                status={product.status}
                oneOfOne={product.one_of_one}
                stockQuantity={product.stock_quantity}
              />
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`aspect-square border bg-neutral-900 overflow-hidden transition-all ${
                    selectedImage === img.url
                      ? 'border-randere-accent ring-1 ring-randere-accent'
                      : 'border-randere-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.altText || ''} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions Column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-randere-muted mb-2">
                <span className="uppercase tracking-widest text-randere-accent">
                  {product.product_type} // ARCHIVE SPEC
                </span>
                <span>•</span>
                <span>GRADE: {product.condition}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-sans leading-tight">
                {product.name}
              </h1>

              <div className="mt-4 flex items-baseline gap-4">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-white">
                  {formatKES(product.price)}
                </span>
                <span className="text-xs font-mono text-randere-muted">
                  INC. TAXES // NAIROBI SAME-DAY READY
                </span>
              </div>
            </div>

            {/* Garment Dimensions & Size */}
            <div className="p-4 bg-randere-dark border border-randere-border space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400">TAGGED FIT / SIZE:</span>
                <span className="font-bold text-randere-accent uppercase tracking-wider">
                  {product.size}
                </span>
              </div>

              {product.measurements && (
                <div className="pt-2 border-t border-randere-border/60">
                  <span className="text-[10px] font-mono text-randere-muted block mb-1 uppercase tracking-wider">
                    STUDIO FLAT MEASUREMENTS:
                  </span>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono text-neutral-300">
                    {Object.entries(product.measurements).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="capitalize text-neutral-500">{k}:</span>
                        <span>{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono text-randere-muted uppercase tracking-widest">
                GARMENT ANATOMY
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Add to Bag CTA */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleAddToBag}
                disabled={isSoldOut || cartLoading}
                className={`w-full py-4 px-6 text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-200 shadow-xl ${
                  isSoldOut
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                    : added
                    ? 'bg-randere-accent text-black font-extrabold'
                    : 'bg-randere-chalk text-black hover:bg-randere-accent'
                }`}
              >
                {isSoldOut ? (
                  'SOLD OUT // PIECE UNAVAILABLE'
                ) : added ? (
                  <>
                    <Check className="w-4 h-4" />
                    ADDED TO ARCHIVE BAG
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    {cartLoading ? 'SECURING PIECE...' : 'ADD TO BAG'}
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 px-1">
                <span>ESTIMATED DELIVERY: 24-48 HRS IN KENYA</span>
                <span className="text-randere-accent">M-PESA / CARD</span>
              </div>
            </div>
          </div>

          {/* Materials & Studio Care */}
          <div className="border-t border-randere-border pt-6 space-y-4 text-xs font-mono">
            {product.materials && (
              <div>
                <span className="text-neutral-500 uppercase block mb-1">MATERIAL COMPOSITION:</span>
                <p className="text-neutral-300">{product.materials}</p>
              </div>
            )}

            {product.care_instructions && (
              <div>
                <span className="text-neutral-500 uppercase block mb-1">STUDIO CARE DIRECTIVE:</span>
                <p className="text-neutral-300 font-light">{product.care_instructions}</p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* 2. THE STORY — Signature RANDERE Transformation Section */}
      {(product.transformation_description || product.original_garment_description) && (
        <section className="border border-randere-border bg-[#101013] p-8 md:p-14 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono tracking-mega text-randere-accent uppercase">
              [ THE STORY &amp; ORIGIN ]
            </span>
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-white font-sans">
              HOW THIS GARMENT WAS REBORN
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-randere-border">
            {product.original_garment_description && (
              <div className="space-y-2">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block">
                  ORIGIN SOURCE // FOUND
                </span>
                <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                  {product.original_garment_description}
                </p>
              </div>
            )}

            {product.transformation_description && (
              <div className="space-y-2">
                <span className="text-xs font-mono text-randere-accent uppercase tracking-widest block">
                  RANDERE STUDIO TRANSFORMATION
                </span>
                <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                  {product.transformation_description}
                </p>
              </div>
            )}
          </div>

          <div className="p-4 bg-neutral-900 border border-neutral-800 flex items-center gap-3 text-xs font-mono text-neutral-300">
            <Scissors className="w-4 h-4 text-randere-accent flex-shrink-0" />
            <span>
              This garment is non-reproducible. The natural vintage fade, texture, and studio tailoring exist exclusively on this single specimen.
            </span>
          </div>
        </section>
      )}
    </div>
  );
};
