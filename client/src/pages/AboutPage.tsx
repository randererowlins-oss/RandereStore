import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Scissors, Sparkles, Flame, Check } from 'lucide-react';
import { TreatmentFlow } from '../components/TreatmentFlow.js';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
      {/* Manifesto Headline */}
      <div className="max-w-3xl space-y-6">
        <span className="text-xs font-mono tracking-mega text-randere-accent uppercase block">
          [ BRAND MANIFESTO ]
        </span>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white font-sans leading-none">
          NOTHING IS FINISHED UNTIL WE SAY IT IS.
        </h1>
        <p className="text-base sm:text-xl text-neutral-300 font-light leading-relaxed">
          RANDERE is a digital-first circular fashion and creative studio originating in Nairobi, Kenya. We transform overlooked secondhand clothing into desirable, expressive, and unrepeatable contemporary fashion.
        </p>
      </div>

      {/* The Core Contrast */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border border-randere-border bg-[#101013] p-8 md:p-14">
        <div className="space-y-4 pr-0 md:pr-8 border-b md:border-b-0 md:border-r border-randere-border pb-8 md:pb-0">
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
            THE CONVENTIONAL THRIFT CYCLE
          </span>
          <h3 className="text-xl font-bold uppercase text-neutral-400 font-sans">
            Buy Bulk &rarr; Minimally Sort &rarr; Resell Cheap
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
            Conventional secondhand clothing operates as a pure volume business. It provides cheap clothing, but leaves vast creative, cultural, and aesthetic value untouched on the warehouse floor.
          </p>
        </div>

        <div className="space-y-4 pl-0 md:pl-8">
          <span className="text-xs font-mono text-randere-accent uppercase tracking-widest">
            THE RANDERE PHILOSOPHY
          </span>
          <h3 className="text-xl font-bold uppercase text-white font-sans">
            Find &rarr; Imagine &rarr; Transform &rarr; Style &rarr; Wear
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
            We treat existing clothing as raw material for new ideas rather than disposable waste. Minor defects become design opportunities. Tailoring becomes transformation. Art becomes wearable.
          </p>
        </div>
      </div>

      {/* The RANDERE Treatment Process */}
      <div className="space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-mono tracking-mega text-randere-accent uppercase">
            [ STUDIO METHODOLOGY ]
          </span>
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-white font-sans">
            THE TREATMENT JOURNEY
          </h2>
        </div>
        <TreatmentFlow />
      </div>

      {/* Physical Studio Vision */}
      <div className="border border-randere-border bg-gradient-to-br from-neutral-950 via-[#131317] to-neutral-950 p-8 md:p-16 space-y-10">
        <div className="space-y-3 max-w-2xl">
          <span className="text-xs font-mono tracking-mega text-randere-accent uppercase">
            [ LONG-TERM VISION ]
          </span>
          <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white font-sans">
            THE PHYSICAL STUDIO
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
            As we scale our digital drops and custom client base, RANDERE is expanding toward our flagship physical hub in Kilimani, Nairobi:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-black/50 border border-randere-border space-y-2">
            <span className="font-mono text-xs text-randere-accent">ZONE 01</span>
            <h4 className="text-sm font-bold text-white uppercase font-sans">THE RACK</h4>
            <p className="text-xs text-neutral-400 font-light">
              Limited-edition drop archive and pristine curated vintage pieces.
            </p>
          </div>

          <div className="p-6 bg-black/50 border border-randere-border space-y-2">
            <span className="font-mono text-xs text-randere-accent">ZONE 02</span>
            <h4 className="text-sm font-bold text-white uppercase font-sans">THE LAB</h4>
            <p className="text-xs text-neutral-400 font-light">
              Active garment reconstruction, tailoring, pattern deconstruction, and mending.
            </p>
          </div>

          <div className="p-6 bg-black/50 border border-randere-border space-y-2">
            <span className="font-mono text-xs text-randere-accent">ZONE 03</span>
            <h4 className="text-sm font-bold text-white uppercase font-sans">THE ART WALL</h4>
            <p className="text-xs text-neutral-400 font-light">
              Live textile painting sessions, pigment testing, and artist collaborations.
            </p>
          </div>

          <div className="p-6 bg-black/50 border border-randere-border space-y-2">
            <span className="font-mono text-xs text-randere-accent">ZONE 04</span>
            <h4 className="text-sm font-bold text-white uppercase font-sans">THE CUSTOM DESK</h4>
            <p className="text-xs text-neutral-400 font-light">
              Walk-in garment drop-offs, consultation, and bespoke rework intake.
            </p>
          </div>

          <div className="p-6 bg-black/50 border border-randere-border space-y-2">
            <span className="font-mono text-xs text-randere-accent">ZONE 05</span>
            <h4 className="text-sm font-bold text-white uppercase font-sans">THE MIRROR</h4>
            <p className="text-xs text-neutral-400 font-light">
              Personal styling suites and event fitting sessions.
            </p>
          </div>

          <div className="p-6 bg-black/50 border border-randere-border space-y-2">
            <span className="font-mono text-xs text-randere-accent">ZONE 06</span>
            <h4 className="text-sm font-bold text-white uppercase font-sans">COMMUNITY HUB</h4>
            <p className="text-xs text-neutral-400 font-light">
              Creative workshops, upcycling masterclasses, and music/fashion listening sessions.
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap gap-4">
          <Link
            to="/shop"
            className="bg-randere-chalk text-black px-8 py-3.5 text-xs font-mono font-bold uppercase tracking-widest hover:bg-randere-accent transition-colors flex items-center gap-2"
          >
            DISCOVER THE CURRENT DROP
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/custom"
            className="border border-neutral-700 text-white px-8 py-3.5 text-xs font-mono uppercase tracking-widest hover:border-randere-accent transition-colors"
          >
            SUBMIT A GARMENT
          </Link>
        </div>
      </div>
    </div>
  );
};
