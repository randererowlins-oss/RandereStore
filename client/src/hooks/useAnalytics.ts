import { api } from '../lib/api.js';

export function useAnalytics() {
  const track = (eventType: string, payload: Record<string, any> = {}) => {
    // Fire and forget
    api.post('/events', { eventType, payload }).catch(() => {});
  };

  return { track };
}
