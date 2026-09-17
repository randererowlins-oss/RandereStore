import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, ArrowRight, AlertCircle, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setSubmitting(true);
      setErrorMsg(null);
      await login(data.email, data.password);
      navigate('/account');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdminQuickFill = () => {
    setValue('email', 'admin@randere.studio');
    setValue('password', 'randere2026');
  };

  const handleCustomerQuickFill = () => {
    setValue('email', 'kevo@randere.studio');
    setValue('password', 'randere2026');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono tracking-mega text-randere-accent uppercase block">
          [ CLIENT / ADMIN PORTAL ]
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white font-sans">
          SIGN IN TO RANDERE
        </h1>
        <p className="text-xs font-mono text-neutral-400">
          ACCESS ORDERS, CUSTOM REQUESTS, AND SAVED ARCHIVES
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
            EMAIL ADDRESS
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
            PASSWORD
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
          {submitting ? 'AUTHENTICATING...' : 'SIGN IN'}
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Demo Fast-fill triggers */}
        <div className="pt-4 border-t border-randere-border/60 space-y-2">
          <span className="text-[10px] font-mono text-neutral-500 uppercase block text-center">
            DEMO CREDENTIALS:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleAdminQuickFill}
              className="px-2 py-1.5 bg-neutral-900 border border-neutral-700 text-[10px] font-mono text-neutral-300 hover:text-randere-accent hover:border-randere-accent text-center"
            >
              FILL ADMIN DEMO
            </button>
            <button
              type="button"
              onClick={handleCustomerQuickFill}
              className="px-2 py-1.5 bg-neutral-900 border border-neutral-700 text-[10px] font-mono text-neutral-300 hover:text-randere-accent hover:border-randere-accent text-center"
            >
              FILL CUSTOMER DEMO
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link
            to="/register"
            className="text-xs font-mono text-randere-muted hover:text-white uppercase tracking-wider"
          >
            DON'T HAVE AN ACCOUNT? REGISTER &rarr;
          </Link>
        </div>
      </form>
    </div>
  );
};
