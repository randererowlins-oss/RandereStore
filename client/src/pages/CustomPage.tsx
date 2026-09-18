import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Scissors, CheckCircle, Sparkles, ArrowRight, Upload } from 'lucide-react';
import { api } from '../lib/api.js';
import { useAuth } from '../hooks/useAuth.js';

const serviceOptions = [
  { id: 'reconstruction', label: 'Reconstruction & Re-tailoring' },
  { id: 'painting', label: 'Hand-Painted Textile Art' },
  { id: 'patchwork', label: 'Sashiko & Fabric Patchwork' },
  { id: 'distressing', label: 'Vintage Fade & Distressing' },
  { id: 'alteration', label: 'Boxy Crop & Silhouette Alteration' },
  { id: 'embroidery', label: 'Custom Stitching & Embroidery' },
  { id: 'dyeing', label: 'Botanical / Pigment Over-Dye' },
  { id: 'full_redesign', label: 'Full Conceptual Redesign' },
];

const customFormSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().min(9, 'Valid phone number is required'),
  garmentType: z.string().min(2, 'Garment type is required (e.g. Denim Jacket, Hoodie, Trousers)'),
  serviceTypes: z.array(z.string()).min(1, 'Select at least one transformation service'),
  budget: z.coerce.number().positive('Budget must be greater than 0').optional().nullable(),
  deadline: z.string().optional().nullable(),
  description: z.string().min(15, 'Please provide a detailed vision of what you want created (min 15 characters)'),
  garmentPhotoUrl: z.string().optional(),
  inspirationPhotoUrl: z.string().optional(),
});

type CustomFormData = z.infer<typeof customFormSchema>;

export const CustomPage: React.FC = () => {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CustomFormData>({
    resolver: zodResolver(customFormSchema),
    defaultValues: {
      customerName: user?.fullName || '',
      customerEmail: user?.email || '',
      customerPhone: user?.phone || '',
      garmentType: '',
      serviceTypes: ['reconstruction'],
      description: '',
      budget: 6000,
    },
  });

  const selectedServices = watch('serviceTypes') || [];

  const toggleService = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setValue(
        'serviceTypes',
        selectedServices.filter((s) => s !== serviceId),
        { shouldValidate: true }
      );
    } else {
      setValue('serviceTypes', [...selectedServices, serviceId], { shouldValidate: true });
    }
  };

  const onSubmit = async (data: CustomFormData) => {
    try {
      setSubmitting(true);
      setErrorMsg(null);

      const payload = {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        garmentType: data.garmentType,
        serviceTypes: data.serviceTypes,
        budget: data.budget,
        deadline: data.deadline || null,
        description: data.description,
        garmentPhotos: data.garmentPhotoUrl ? [data.garmentPhotoUrl] : [],
        inspirationPhotos: data.inspirationPhotoUrl ? [data.inspirationPhotoUrl] : [],
      };

      const res = await api.post('/custom-requests', payload);
      if (res.success) {
        setSubmitted(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit request');
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
          [ INTAKE RECEIVED ]
        </span>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white font-sans">
          WE WILL RESURRECT IT.
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed max-w-md mx-auto">
          Our studio team will review your garment details and reach out within 24 hours with a custom transformation quote and delivery/drop-off instructions.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="bg-randere-chalk text-black px-6 py-3 text-xs font-mono uppercase font-bold tracking-widest hover:bg-randere-accent transition-colors"
        >
          SUBMIT ANOTHER GARMENT
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Editorial Manifesto Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-mono tracking-mega text-randere-accent uppercase block">
          [ BESPOKE WORKSHOP ]
        </span>
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-sans leading-none">
          BRING US SOMETHING <br />
          <span className="text-randere-chalk underline decoration-randere-accent underline-offset-8">
            ORDINARY.
          </span>
        </h1>
        <p className="text-sm md:text-base text-neutral-300 font-light leading-relaxed pt-2">
          You don't need to throw out garments with outdated silhouettes or wear. Send your jeans, jackets, hoodies, or shirts into our Kilimani studio. We evaluate the fabric, propose architectural cuts, and turn them into wearable art.
        </p>
      </div>

      {/* Process Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border border-randere-border bg-randere-dark/50 space-y-2">
          <span className="font-mono text-xs text-randere-accent">01 // AUDIT</span>
          <h4 className="text-sm font-bold text-white uppercase font-sans">Intake &amp; Evaluation</h4>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            We assess the textile condition, fabric weight, and structural possibilities of your piece.
          </p>
        </div>

        <div className="p-6 border border-randere-border bg-randere-dark/50 space-y-2">
          <span className="font-mono text-xs text-randere-accent">02 // DESIGN</span>
          <h4 className="text-sm font-bold text-white uppercase font-sans">Custom Mockup &amp; Quote</h4>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            Receive a transparent quote and creative sketches based on your aesthetic vibe and budget.
          </p>
        </div>

        <div className="p-6 border border-randere-border bg-randere-dark/50 space-y-2">
          <span className="font-mono text-xs text-randere-accent">03 // EXECUTION</span>
          <h4 className="text-sm font-bold text-white uppercase font-sans">Studio Transformation</h4>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            Our tailors and painters deconstruct, cut, stitch, and cure the piece. Delivered back to you in 7-14 days.
          </p>
        </div>
      </div>

      {/* Submission Intake Form */}
      <div className="max-w-4xl mx-auto border border-randere-border bg-[#101013] p-8 md:p-14 space-y-8">
        <div className="space-y-2 pb-4 border-b border-randere-border">
          <span className="text-xs font-mono text-randere-accent uppercase tracking-widest">
            TRANSFORMATION INTAKE DOSSIER
          </span>
          <h2 className="text-2xl font-bold uppercase text-white font-sans">
            TELL US ABOUT THE GARMENT
          </h2>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-950/40 border border-red-700 text-xs font-mono text-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Contact Details */}
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
                PHONE (WHATSAPP/CALL) *
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

          {/* Garment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                GARMENT CLASSIFICATION *
              </label>
              <input
                type="text"
                {...register('garmentType')}
                placeholder="e.g. Denim Trucker Jacket, 501 Jeans, Vintage Flannel"
                className="w-full bg-neutral-900 border border-randere-border px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
              />
              {errors.garmentType && (
                <span className="text-[10px] text-red-400 font-mono mt-1 block">
                  {errors.garmentType.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                TARGET BUDGET ESTIMATE (KES)
              </label>
              <input
                type="number"
                {...register('budget')}
                placeholder="e.g. 5000"
                className="w-full bg-neutral-900 border border-randere-border px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
              />
            </div>
          </div>

          {/* Services Checklist */}
          <div>
            <label className="block text-[11px] font-mono text-neutral-400 mb-3">
              SELECT REWORK TECHNIQUES DESIRED *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {serviceOptions.map((s) => {
                const isChecked = selectedServices.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleService(s.id)}
                    className={`p-3 text-left border text-xs font-mono uppercase transition-colors flex items-center justify-between ${
                      isChecked
                        ? 'bg-neutral-900 border-randere-accent text-randere-accent font-bold'
                        : 'border-randere-border text-neutral-400 hover:border-neutral-600'
                    }`}
                  >
                    <span>{s.label}</span>
                    {isChecked && <CheckCircle className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
            {errors.serviceTypes && (
              <span className="text-[10px] text-red-400 font-mono mt-2 block">
                {errors.serviceTypes.message}
              </span>
            )}
          </div>

          {/* Vision Description */}
          <div>
            <label className="block text-[11px] font-mono text-neutral-400 mb-1">
              TRANSFORMATION BRIEF &amp; VISION *
            </label>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="Describe what you want changed: cropped boxy silhouette, hand-painted anime/calligraphy motif, patches from leftover fabric, frayed hem, etc..."
              className="w-full bg-neutral-900 border border-randere-border p-3 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
            />
            {errors.description && (
              <span className="text-[10px] text-red-400 font-mono mt-1 block">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Photo references */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                PHOTO OF YOUR GARMENT (IMAGE URL)
              </label>
              <input
                type="url"
                {...register('garmentPhotoUrl')}
                placeholder="https://..."
                className="w-full bg-neutral-900 border border-randere-border px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                INSPIRATION / REFERENCE IMAGE (URL)
              </label>
              <input
                type="url"
                {...register('inspirationPhotoUrl')}
                placeholder="https://..."
                className="w-full bg-neutral-900 border border-randere-border px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-randere-chalk text-black py-4 text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-randere-accent transition-colors shadow-2xl disabled:opacity-50"
          >
            {submitting ? 'LOGGING INTAKE BRIEF...' : 'SUBMIT GARMENT FOR TRANSFORMATION'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
