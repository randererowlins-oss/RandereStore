import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Scissors, Flame, ArrowUpRight } from 'lucide-react';
import { ProductCard } from '../components/ProductCard.js';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider.js';
import { TreatmentFlow } from '../components/TreatmentFlow.js';
import { api } from '../lib/api.js';
import { Product, Story } from '../types/index.js';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [prodRes, storyRes] = await Promise.all([
          api.get('/products/featured'),
          api.get('/stories?limit=3'),
        ]);
        if (prodRes.success) setFeaturedProducts(prodRes.data);
        if (storyRes.success) setStories(storyRes.data);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="space-y-24 md:space-y-36 pb-24">
      {/* 1. Hero Campaign Banner */}
      <section className="relative min-h-[90vh] flex items-end pb-16 md:pb-24 border-b border-randere-border overflow-hidden">
        {/* Editorial Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2000&q=85"
            alt="RANDERE Campaign Model"
            className="w-full h-full object-cover object-top filter brightness-[0.45] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/60 border border-neutral-700 backdrop-blur-md">
              <span className="w-2 h-2 bg-randere-accent rounded-full animate-ping" />
              <span className="text-[11px] font-mono tracking-widest text-randere-chalk uppercase">
                DROP 01 // NAIROBI STUDIO ARCHIVE
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase font-sans text-white leading-[0.9]">
              FIND. <br />
              REMAKE. <br />
              <span className="text-randere-chalk underline decoration-randere-accent underline-offset-8">
                WEAR.
              </span>
            </h1>

            <p className="text-sm md:text-base font-light text-neutral-300 max-w-lg leading-relaxed">
              Curated secondhand fashion deconstructed, repaired, and hand-treated into runway-grade streetwear. Every garment is an individual identity.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/shop"
                className="bg-randere-chalk text-black px-8 py-4 text-xs font-mono font-bold tracking-widest uppercase hover:bg-randere-accent transition-all duration-300 flex items-center gap-2 shadow-2xl"
              >
                SHOP THE DROP
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#treatment"
                className="border border-neutral-500 text-white px-8 py-4 text-xs font-mono font-medium tracking-widest uppercase hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                SEE THE PROCESS
              </a>
            </div>
          </div>
        </div>

        {/* Subtle Scarcity Sub-label */}
        <div className="hidden lg:block absolute bottom-8 right-8 z-10 text-right font-mono text-[11px] text-neutral-400">
          <p>LOC: KILIMANI / GIKOMBA</p>
          <p className="text-randere-accent">LIMITED ARCHIVE PIECES ONLY</p>
        </div>
      </section>

      {/* 2. Featured Drop Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-randere-border gap-4">
          <div>
            <span className="text-xs font-mono tracking-mega text-randere-accent uppercase block mb-1">
              [ CURATED ARCHIVE ]
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight uppercase text-white font-sans">
              FEATURED DROP
            </h2>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-1 text-xs font-mono tracking-widest uppercase text-randere-chalk hover:text-randere-accent transition-colors"
          >
            VIEW ALL RELEASES &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. Before / After Interactive Transformation Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-mono tracking-mega text-randere-accent uppercase block">
              [ THE METAMORPHOSIS ]
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight uppercase text-white leading-tight font-sans">
              FOUND <br />
              &rarr; REWORKED <br />
              &rarr; RANDERE.
            </h2>
            <p className="text-sm text-neutral-400 font-light leading-relaxed">
              We look at discarded textiles differently. Where others see wear and outdated proportions, our studio sees the foundation of a one-of-one statement piece.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs font-mono text-neutral-300">
                <Scissors className="w-4 h-4 text-randere-accent" />
                <span>ARCHITECTURAL CROPPING &amp; BOX-FIT TAILORING</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-neutral-300">
                <Sparkles className="w-4 h-4 text-randere-accent" />
                <span>PERMANENT HEAT-CURED TEXTILE BRUSHWORK</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-neutral-300">
                <Flame className="w-4 h-4 text-randere-accent" />
                <span>100% CIRCULAR RAW MATERIAL RETENTION</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/transformations"
                className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-700 text-white px-6 py-3 text-xs font-mono tracking-widest uppercase hover:border-randere-accent hover:text-randere-accent transition-colors"
              >
                BROWSE ALL TRANSFORMATIONS
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <BeforeAfterSlider
              beforeImage="https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1200&q=80"
              afterImage="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=80"
              beforeLabel="GIKOMBA BALES (FOUND)"
              afterLabel="RANDERE R-01 (REWORKED)"
            />
          </div>
        </div>
      </section>

      {/* 4. The RANDERE Treatment (Process) */}
      <section id="treatment" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-mono tracking-mega text-randere-accent uppercase">
            [ STUDIO PROTOCOL ]
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight uppercase text-white font-sans">
            THE RANDERE TREATMENT
          </h2>
          <p className="text-xs md:text-sm text-neutral-400 font-light">
            Every garment entering our ecosystem passes through six rigorous creative checkpoints before release.
          </p>
        </div>

        <TreatmentFlow />
      </section>

      {/* 5. Wearable Art & Custom Studio Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative border border-randere-border bg-gradient-to-r from-neutral-950 via-[#121215] to-neutral-950 p-8 md:p-16 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-mono tracking-mega text-randere-accent uppercase">
                [ BESPOKE SERVICES ]
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase text-white font-sans leading-tight">
                BRING US SOMETHING ORDINARY.
              </h2>
              <p className="text-sm text-neutral-400 font-light leading-relaxed">
                Got a jacket, pair of jeans, or oversized shirt in your wardrobe that you never wear? Send it to the RANDERE Lab. Our tailors and artists will re-cut, distress, paint, and revive it into a one-of-one statement piece.
              </p>
              <div>
                <Link
                  to="/custom"
                  className="bg-randere-chalk text-black px-8 py-3.5 text-xs font-mono font-bold tracking-widest uppercase hover:bg-randere-accent transition-colors inline-flex items-center gap-2"
                >
                  START A CUSTOM REWORK
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative aspect-video lg:aspect-square overflow-hidden border border-randere-border">
              <img
                src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80"
                alt="Studio painting denim"
                className="w-full h-full object-cover filter contrast-125"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-3 border border-neutral-800 text-[11px] font-mono text-neutral-300">
                ACTIVE LAB SESSION // ACRYLIC TEXTILE BINDER FIXATION
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Styling Service — GET PLUGGED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#111114] border border-randere-border p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono tracking-mega text-randere-accent uppercase">
              [ STYLING CONCIERGE ]
            </span>
            <h3 className="text-2xl md:text-4xl font-bold uppercase tracking-tight text-white font-sans">
              DON'T KNOW WHAT TO WEAR? <br />
              <span className="text-randere-accent">GET PLUGGED.</span>
            </h3>
            <p className="text-xs md:text-sm text-neutral-400 font-light leading-relaxed">
              Tell us your occasion, budget, and aesthetic vibe. Our creative team personally curates and pieces together complete circular streetwear looks.
            </p>
          </div>

          <Link
            to="/style"
            className="w-full md:w-auto bg-randere-accent text-black px-8 py-4 text-xs font-mono font-bold tracking-widest uppercase hover:bg-white transition-colors flex items-center justify-center gap-2 flex-shrink-0"
          >
            GET PLUGGED NOW
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 7. Stories / Editorial Journal Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10 pb-4 border-b border-randere-border">
          <div>
            <span className="text-xs font-mono tracking-mega text-randere-accent uppercase block mb-1">
              [ EDITORIAL JOURNAL ]
            </span>
            <h2 className="text-3xl font-bold tracking-tight uppercase text-white font-sans">
              STORIES &amp; CULTURE
            </h2>
          </div>
          <Link
            to="/stories"
            className="text-xs font-mono tracking-widest uppercase text-randere-chalk hover:text-randere-accent transition-colors hidden sm:block"
          >
            ALL ESSAYS &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story) => (
            <article
              key={story.id}
              className="group flex flex-col justify-between border border-randere-border bg-randere-card/30 hover:border-neutral-500 transition-colors"
            >
              <div>
                <Link to={`/stories/${story.slug}`} className="block aspect-[16/10] overflow-hidden bg-neutral-900">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="p-6 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-randere-muted uppercase">
                    <span>{story.contentType}</span>
                    <span>•</span>
                    <span>{story.readTimeMinutes} MIN READ</span>
                  </div>
                  <Link to={`/stories/${story.slug}`}>
                    <h3 className="text-base font-bold text-white group-hover:text-randere-accent transition-colors leading-snug">
                      {story.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-neutral-400 font-light line-clamp-3 leading-relaxed">
                    {story.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  to={`/stories/${story.slug}`}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-randere-accent uppercase tracking-wider group-hover:underline"
                >
                  READ STORY <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
