import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Flame, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../lib/api.js';
import { useAuth } from '../hooks/useAuth.js';

const stylingSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().min(9, 'Valid phone number is required'),
  occasion: z.string().min(2, 'Occasion is required (e.g. Birthday, Album Release, Date Night, Street Drop)'),
  eventDate: z.string().optional().nullable(),
  budget: z.coerce.number().positive('Budget is required').optional().nullable(),
  preferredAesthetic: z.string().min(2, 'Please select your preferred aesthetic'),
  size: z.string().min(1, 'Size is required'),
  presentationPreference: z.string().min(1, 'Presentation preference is required'),
  colorPreferences: z.string().optional().nullable(),
  referencePhotoUrl: z.string().optional(),
  additionalNotes: z.string().optional().nullable(),
});

type StylingFormData = z.infer<typeof stylingSchema>;

const aesthetics = [
  'Architectural Brutalism & Raw Canvas',
  'Reconstructed Utilitarian / Tactical Cargo',
  'Vintage 90s Oversized Streetwear',
  'Wearable Art & Hand-Painted Expressionism',
  'Minimalist Tailored Monochromatic',
];

export const StylePage: React.FC = () => {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StylingFormData>({
    resolver: zodResolver(stylingSchema),
    defaultValues: {
      customerName: user?.fullName || '',
      customerEmail: user?.email || '',
      customerPhone: user?.phone || '',
      budget: 12000,
      size: 'M',
      presentationPreference: 'Unisex',
      preferredAesthetic: aesthetics[0],
    },
  });

  const onSubmit = async (data: StylingFormData) => {
    try {
      setSubmitting(true);
      setErrorMsg(null);

      const payload = {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        occasion: data.occasion,
        eventDate: data.eventDate || null,
        budget: data.budget,
        preferredAesthetic: data.preferredAesthetic,
        size: data.size,
        presentationPreference: data.presentationPreference,
        colorPreferences: data.colorPreferences || null,
        referencePhotos: data.referencePhotoUrl ? [data.referencePhotoUrl] : [],
        additionalNotes: data.additionalNotes || null,
      };

      const res = await api.post('/styling-requests', payload);
      if (res.success) {
        setSubmitted(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit styling brief');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 bg-neutral-900 border border-randere-accent text-randere-accent flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8" />
        </div>
        <span className="text-xs font-mono tracking-mega text-randere-accent uppercase block">
          [ STYLING INTAKE PLUGGED ]
        </span>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white font-sans">
          YOU'RE PLUGGED IN.
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed max-w-md mx-auto">
          Our stylist lead will review your occasion, build a cohesive 3-piece circular outfit deck, and message you on WhatsApp within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="bg-randere-chalk text-black px-6 py-3 text-xs font-mono uppercase font-bold tracking-widest hover:bg-randere-accent transition-colors"
        >
          SUBMIT ANOTHER LOOK
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Manifesto Headline */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-mono tracking-mega text-randere-accent uppercase block">
          [ STYLING CONCIERGE ]
        </span>
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-sans leading-none">
          DON'T KNOW WHAT TO WEAR? <br />
          <span className="text-randere-chalk underline decoration-randere-accent underline-offset-8">
            GET PLUGGED.
          </span>
        </h1>
        <p className="text-sm md:text-base text-neutral-300 font-light leading-relaxed pt-2">
          Stop staring at clothes that lack energy. Whether it's a creative showcase, a headline DJ set, a campaign photoshoot, or a date night where you need to stand out, our stylists engineer your entire silhouette from the shoes up.
        </p>
      </div>

      {/* The 3 Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border border-randere-border bg-randere-dark/50 space-y-2">
          <span className="font-mono text-xs text-randere-accent">01 // TASTE OVER MASS-MARKET</span>
          <h4 className="text-sm font-bold text-white uppercase font-sans">Zero Fast Fashion</h4>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            Every piece curated is an archival, reconstructed, or vintage one-of-one item with texture and patina.
          </p>
        </div>

        <div className="p-6 border border-randere-border bg-randere-dark/50 space-y-2">
          <span className="font-mono text-xs text-randere-accent">02 // TAILORED PROPORTIONS</span>
          <h4 className="text-sm font-bold text-white uppercase font-sans">Custom Studio Fitting</h4>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            We adjust lengths, hems, and fits to ensure the proportions complement your natural frame.
          </p>
        </div>

        <div className="p-6 border border-randere-border bg-randere-dark/50 space-y-2">
          <span className="font-mono text-xs text-randere-accent">03 // THE PLUG EFFECT</span>
          <h4 className="text-sm font-bold text-white uppercase font-sans">Unrepeatable Presence</h4>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            Guaranteed conversation starter. Nobody in the room will have walked in wearing the same thing.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-4xl mx-auto border border-randere-border bg-[#101013] p-8 md:p-14 space-y-8">
        <div className="space-y-2 pb-4 border-b border-randere-border">
          <span className="text-xs font-mono text-randere-accent uppercase tracking-widest">
            STYLING INTAKE PROTOCOL
          </span>
          <h2 className="text-2xl font-bold uppercase text-white font-sans">
            CURATION DOSSIER
          </h2>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-950/40 border border-red-700 text-xs font-mono text-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                YOUR NAME *
              </label>
              <input
                type="text"
                {...register('customerName')}
                placeholder="Full Name"
                className="w-full bg-neutral-900 border border-randere-border px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
              />
              {errors.customerName && (
                <span className="text-[10px] text-red-400 font-mono mt-1 block">
                  {errors.customerName.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                EMAIL *
              </label>
              <input
                type="email"
                {...register('customerEmail')}
                placeholder="name@domain.com"
                className="w-full bg-neutral-900 border border-randere-border px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
              />
              {errors.customerEmail && (
                <span className="text-[10px] text-red-400 font-mono mt-1 block">
                  {errors.customerEmail.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                PHONE (WHATSAPP) *
              </label>
              <input
                type="tel"
                {...register('customerPhone')}
                placeholder="+254 7..."
                className="w-full bg-neutral-900 border border-randere-border px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
              />
              {errors.customerPhone && (
                <span className="text-[10px] text-red-400 font-mono mt-1 block">
                  {errors.customerPhone.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                OCCASION / EVENT *
              </label>
              <input
                type="text"
                {...register('occasion')}
                placeholder="e.g. Festival, Birthday, Date, DJ Gig"
                className="w-full bg-neutral-900 border border-randere-border px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
              />
              {errors.occasion && (
                <span className="text-[10px] text-red-400 font-mono mt-1 block">
                  {errors.occasion.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                EVENT DATE (IF KNOWN)
              </label>
              <input
                type="date"
                {...register('eventDate')}
                className="w-full bg-neutral-900 border border-randere-border px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                TOTAL OUTFIT BUDGET (KES)
              </label>
              <input
                type="number"
                {...register('budget')}
                placeholder="e.g. 15000"
                className="w-full bg-neutral-900 border border-randere-border px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                AESTHETIC VIBE *
              </label>
              <select
                {...register('preferredAesthetic')}
                className="w-full bg-neutral-900 border border-randere-border px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
              >
                {aesthetics.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                TOP / BOTTOM SIZE *
              </label>
              <input
                type="text"
                {...register('size')}
                placeholder="e.g. Top L, Pants 32"
                className="w-full bg-neutral-900 border border-randere-border px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
              />
              {errors.size && (
                <span className="text-[10px] text-red-400 font-mono mt-1 block">
                  {errors.size.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                PRESENTATION PREFERENCE *
              </label>
              <select
                {...register('presentationPreference')}
                className="w-full bg-neutral-900 border border-randere-border px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
              >
                <option value="Unisex">Unisex / Streetwear</option>
                <option value="Menswear">Menswear Tailored</option>
                <option value="Womenswear">Womenswear Contemporary</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                PREFERRED COLORS / PALETTE
              </label>
              <input
                type="text"
                {...register('colorPreferences')}
                placeholder="e.g. Earth tones, washed black, cobalt accents"
                className="w-full bg-neutral-900 border border-randere-border px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                MOODBOARD / REFERENCE IMAGE (URL)
              </label>
              <input
                type="url"
                {...register('referencePhotoUrl')}
                placeholder="https://..."
                className="w-full bg-neutral-900 border border-randere-border px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-neutral-400 mb-1">
              SPECIFIC PREFERENCES OR WHAT TO AVOID
            </label>
            <textarea
              {...register('additionalNotes')}
              rows={3}
              placeholder="Tell us what you love or hate (e.g. 'I hate skinny jeans', 'I love heavy denim jackets with deep pockets', 'Must work with chunky sneakers')..."
              className="w-full bg-neutral-900 border border-randere-border p-3 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-randere-accent text-black py-4 text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-2xl disabled:opacity-50"
          >
            {submitting ? 'PLUGGING IN...' : 'GET PLUGGED (SUBMIT BRIEF)'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
