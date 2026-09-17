import React, { useState, useEffect } from 'react';
import { Scissors, Sparkles, Phone, Mail, Check, MessageSquare } from 'lucide-react';
import { api } from '../lib/api.js';
import { CustomRequest, StylingRequest } from '../types/index.js';
import { formatKES, formatDate } from '../lib/utils.js';

export const AdminRequestsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'custom' | 'styling'>('custom');
  const [customRequests, setCustomRequests] = useState<CustomRequest[]>([]);
  const [stylingRequests, setStylingRequests] = useState<StylingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const [customRes, stylingRes] = await Promise.all([
        api.get('/custom-requests'),
        api.get('/styling-requests'),
      ]);
      if (customRes.success) setCustomRequests(customRes.data || []);
      if (stylingRes.success) setStylingRequests(stylingRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleUpdateCustom = async (id: string, status: any, quote?: number, notes?: string) => {
    try {
      await api.patch(`/custom-requests/${id}/status`, {
        status,
        quoteAmount: quote,
        adminNotes: notes,
      });
      await loadRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStyling = async (id: string, status: any, stylistNotes?: string) => {
    try {
      await api.patch(`/styling-requests/${id}/status`, {
        status,
        stylistNotes,
      });
      await loadRequests();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 text-xs font-mono">
      <div className="flex items-center justify-between pb-6 border-b border-randere-border">
        <div>
          <span className="text-xs font-mono tracking-mega text-randere-accent uppercase block mb-1">
            [ BESPOKE COMMISSIONS &amp; CONSULTATIONS ]
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
            CLIENT REQUESTS
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-2 uppercase border ${
              activeTab === 'custom'
                ? 'bg-randere-accent text-black font-bold border-randere-accent'
                : 'border-randere-border text-neutral-400'
            }`}
          >
            CUSTOM REWORKS ({customRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('styling')}
            className={`px-3 py-2 uppercase border ${
              activeTab === 'styling'
                ? 'bg-randere-accent text-black font-bold border-randere-accent'
                : 'border-randere-border text-neutral-400'
            }`}
          >
            STYLING BRIEFS ({stylingRequests.length})
          </button>
        </div>
      </div>

      {activeTab === 'custom' ? (
        <div className="space-y-6">
          {customRequests.map((req) => (
            <div
              key={req.id}
              className="p-6 bg-[#111114] border border-randere-border space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-randere-border gap-2">
                <div>
                  <span className="text-randere-accent font-bold text-sm uppercase">
                    {req.garmentType}
                  </span>
                  <span className="text-neutral-500 ml-3">
                    SUBMITTED: {formatDate(req.created_at)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">WORKFLOW:</span>
                  <select
                    value={req.status}
                    onChange={(e) => handleUpdateCustom(req.id, e.target.value)}
                    className="bg-neutral-900 border border-neutral-700 p-1 text-white uppercase text-[11px]"
                  >
                    <option value="SUBMITTED">SUBMITTED</option>
                    <option value="REVIEWING">REVIEWING</option>
                    <option value="QUOTED">QUOTED</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="READY">READY</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="DECLINED">DECLINED</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-neutral-300 font-light leading-relaxed">
                  "{req.description}"
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {req.serviceTypes?.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-400 text-[10px] uppercase"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Photos if provided */}
              {(req.garmentPhotos?.length || req.inspirationPhotos?.length) && (
                <div className="flex items-center gap-3 pt-2">
                  {req.garmentPhotos?.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer" className="block">
                      <img
                        src={url}
                        alt="Garment"
                        className="w-14 h-14 object-cover border border-neutral-700 hover:border-randere-accent"
                      />
                    </a>
                  ))}
                  {req.inspirationPhotos?.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer" className="block">
                      <img
                        src={url}
                        alt="Inspo"
                        className="w-14 h-14 object-cover border border-neutral-700 hover:border-randere-accent"
                      />
                    </a>
                  ))}
                </div>
              )}

              {/* Client Info & Quote Adjustment */}
              <div className="pt-3 border-t border-randere-border flex flex-col sm:flex-row sm:items-center justify-between text-neutral-400 gap-4">
                <div>
                  <span className="text-white font-bold">{req.customerName}</span> //{' '}
                  <span className="text-randere-accent">{req.customerPhone}</span> (
                  {req.customerEmail})
                </div>

                <div className="flex items-center gap-2">
                  <span>QUOTE:</span>
                  <input
                    type="number"
                    defaultValue={req.quoteAmount || ''}
                    placeholder="KES Quote"
                    onBlur={(e) =>
                      handleUpdateCustom(
                        req.id,
                        req.status,
                        parseFloat(e.target.value) || undefined
                      )
                    }
                    className="w-28 bg-neutral-900 border border-neutral-700 px-2 py-1 text-white text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {stylingRequests.map((st) => (
            <div
              key={st.id}
              className="p-6 bg-[#111114] border border-randere-border space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-randere-border gap-2">
                <div>
                  <span className="text-randere-accent font-bold text-sm uppercase">
                    OCCASION: {st.occasion}
                  </span>
                  <span className="text-neutral-500 ml-3">
                    SUBMITTED: {formatDate(st.created_at)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">STATUS:</span>
                  <select
                    value={st.status}
                    onChange={(e) => handleUpdateStyling(st.id, e.target.value)}
                    className="bg-neutral-900 border border-neutral-700 p-1 text-white uppercase text-[11px]"
                  >
                    <option value="SUBMITTED">SUBMITTED</option>
                    <option value="REVIEWING">REVIEWING</option>
                    <option value="CURATED">CURATED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="DECLINED">DECLINED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-neutral-300">
                <div>
                  <span className="text-neutral-500 block text-[10px]">AESTHETIC:</span>
                  <span className="text-white font-bold">{st.preferredAesthetic}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">SIZE / GENDER:</span>
                  <span>
                    {st.size} ({st.presentationPreference})
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">BUDGET:</span>
                  <span className="text-randere-accent font-bold">
                    {st.budget ? formatKES(st.budget) : 'Flexible'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">CLIENT:</span>
                  <span className="text-white">
                    {st.customerName} ({st.customerPhone})
                  </span>
                </div>
              </div>

              {st.additionalNotes && (
                <p className="text-neutral-300 font-light italic">
                  "{st.additionalNotes}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
