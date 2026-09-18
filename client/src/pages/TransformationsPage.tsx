import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Scissors, Sparkles, User, Palette } from 'lucide-react';
import { api } from '../lib/api.js';
import { Transformation } from '../types/index.js';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider.js';

export const TransformationsPage: React.FC = () => {
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransformations() {
      try {
        setLoading(true);
        const res = await api.get('/transformations');
        if (res.success && res.data) {
          setTransformations(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTransformations();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Manifesto Headline */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-mono tracking-mega text-randere-accent uppercase block">
          [ SIGNATURE ARCHIVE ]
        </span>
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-sans leading-none">
          FOUND &rarr; MADE.
        </h1>
        <p className="text-sm md:text-base text-neutral-300 font-light leading-relaxed pt-2">
          Documenting the anatomy of resurrection. Every piece begins as an overlooked secondhand garment and emerges as a runway-grade artifact through tailoring, deconstruction, and fine-art intervention.
        </p>
      </div>

      {/* Transformations List */}
      {loading ? (
        <div className="space-y-12 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="aspect-[16/9] bg-neutral-900 border border-randere-border" />
          ))}
        </div>
      ) : (
        <div className="space-y-24">
          {transformations.map((item, idx) => (
            <div
              key={item.id}
              className="border border-randere-border bg-[#101013] p-6 md:p-12 space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-baseline justify-between pb-6 border-b border-randere-border gap-2">
                <div>
                  <span className="text-xs font-mono text-randere-accent uppercase tracking-widest block mb-1">
                    METAMORPHOSIS #{String(idx + 1).padStart(2, '0')} // {item.garmentType}
                  </span>
                  <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight text-white font-sans">
                    {item.title}
                  </h2>
                </div>

                {item.relatedProductId && (
                  <Link
                    to={`/shop`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-randere-accent uppercase tracking-wider hover:underline"
                  >
                    VIEW REWORKED SPEC &rarr;
                  </Link>
                )}
              </div>

              {/* Slider for Interactive comparison */}
              <BeforeAfterSlider
                beforeImage={item.originalGarmentImageUrl}
                afterImage={item.finalGarmentImageUrl}
                beforeLabel="ORIGINAL THRIFT SPEC (FOUND)"
                afterLabel="RANDERE METAMORPHOSIS (MADE)"
              />

              {/* 3-Column Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                {/* 1. Origin Garment */}
                <div className="space-y-2 p-5 bg-neutral-900/60 border border-randere-border">
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block">
                    01 // THE FOUND SPECIMEN
                  </span>
                  <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                    {item.originalGarmentDescription}
                  </p>
                </div>

                {/* 2. Process */}
                <div className="space-y-2 p-5 bg-neutral-900/60 border border-randere-border">
                  <span className="text-xs font-mono text-randere-accent uppercase tracking-widest block">
                    02 // STUDIO INTERVENTION
                  </span>
                  <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                    {item.processDescription}
                  </p>
                </div>

                {/* 3. Final Result */}
                <div className="space-y-2 p-5 bg-neutral-900/60 border border-randere-border">
                  <span className="text-xs font-mono text-white uppercase tracking-widest block">
                    03 // RUNWAY RESULT
                  </span>
                  <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                    {item.finalGarmentDescription}
                  </p>
                </div>
              </div>

              {/* Techniques & Attributions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-randere-border text-xs font-mono text-randere-muted gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-white uppercase font-bold mr-1">TECHNIQUES:</span>
                  {item.techniques.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 bg-neutral-900 border border-neutral-700 text-neutral-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-[11px]">
                  {item.artistAttribution && (
                    <span className="flex items-center gap-1 text-randere-chalk">
                      <Palette className="w-3.5 h-3.5 text-randere-accent" />
                      ART: {item.artistAttribution}
                    </span>
                  )}
                  {item.tailorAttribution && (
                    <span className="flex items-center gap-1 text-randere-chalk">
                      <Scissors className="w-3.5 h-3.5 text-randere-accent" />
                      TAILOR: {item.tailorAttribution}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
