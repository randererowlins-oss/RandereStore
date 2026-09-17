import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setSubmitting(true);
      setErrorMsg(null);
      await registerAuth({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        phone: data.phone,
      });
      navigate('/account');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="max-w-md mx-auto px-4 py-20 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono tracking-mega text-randere-accent uppercase block">
          [ JOIN THE CIRCLE ]
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white font-sans">
          CREATE ACCOUNT
        </h1>
        <p className="text-xs font-mono text-neutral-400">
          TRACK DROPS, BESPOKE COMMISSIONS &amp; ORDER HISTORIES
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-950/40 border border-red-700 text-xs font-mono text-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 bg-randere-card/50 border border-randere-border space-y-6">
        <div>
          <label className="block text-[11px] font-mono text-neutral-400 mb-1">
            FULL NAME *
          </label>
          <input
            type="text"
            {...register('fullName')}
            placeholder="e.g. Kevo Mwangi"
            className="w-full bg-neutral-900 border border-randere-border px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
          />
          {errors.fullName && (
            <span className="text-[10px] text-red-400 font-mono mt-1 block">
              {errors.fullName.message}
            </span>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-mono text-neutral-400 mb-1">
            EMAIL ADDRESS *
          </label>
          <input
            type="email"
            {...register('email')}
            placeholder="name@domain.com"
            className="w-full bg-neutral-900 border border-randere-border px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
          />
          {errors.email && (
            <span className="text-[10px] text-red-400 font-mono mt-1 block">
              {errors.email.message}
            </span>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-mono text-neutral-400 mb-1">
            PHONE (OPTIONAL)
          </label>
          <input
            type="tel"
            {...register('phone')}
            placeholder="+254 7XX XXX XXX"
            className="w-full bg-neutral-900 border border-randere-border px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-neutral-400 mb-1">
            PASSWORD (MIN 6 CHARACTERS) *
          </label>
          <input
            type="password"
            {...register('password')}
            placeholder="••••••••"
            className="w-full bg-neutral-900 border border-randere-border px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-randere-accent"
          />
          {errors.password && (
            <span className="text-[10px] text-red-400 font-mono mt-1 block">
              {errors.password.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-randere-chalk text-black py-3.5 text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-randere-accent transition-colors shadow-2xl disabled:opacity-50"
        >
          {submitting ? 'REGISTERING...' : 'REGISTER ACCOUNT'}
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="text-xs font-mono text-randere-muted hover:text-white uppercase tracking-wider"
          >
            ALREADY REGISTERED? SIGN IN &rarr;
          </Link>
        </div>
      </form>
    </div>
  );
};
