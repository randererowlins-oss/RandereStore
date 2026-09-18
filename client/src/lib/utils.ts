import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKES(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null) return 'KSh 0';
  const numeric = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `KSh ${numeric.toLocaleString('en-KE')}`;
}

export function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem('randere_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('randere_session_id', sessionId);
  }
  return sessionId;
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-KE', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
