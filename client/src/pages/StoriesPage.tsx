import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { api } from '../lib/api.js';
import { Story } from '../types/index.js';
import { formatDate } from '../lib/utils.js';

const filters = [
  { name: 'ALL ESSAYS', value: 'ALL' },
  { name: 'TRANSFORMATIONS', value: 'transformation' },
  { name: 'ARTIST FEATURES', value: 'artist_feature' },
  { name: 'BEHIND THE SCENES', value: 'behind_the_scenes' },
  { name: 'MANIFESTOS', value: 'story' },
];

export const StoriesPage: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStories() {
      try {
        setLoading(true);
        const endpoint = activeFilter === 'ALL' ? '/stories' : `/stories?contentType=${activeFilter}`;
        const res = await api.get(endpoint);
        if (res.success && res.data) {
          setStories(res.data);
        }
      } catch (err) {
        console.error('Failed to load stories:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStories();
  }, [activeFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Editorial Header */}
      <div className="border-b border-randere-border pb-6 space-y-3">
        <span className="text-xs font-mono tracking-mega text-randere-accent uppercase block">
          [ THE RANDERE JOURNAL ]
        </span>
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-sans">
          STORIES &amp; CULTURE
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-xl">
          Dispatches from our Nairobi studio, garment origin archives, textile pigment experiments, and conversations on circular fashion.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border transition-colors whitespace-nowrap ${
              activeFilter === f.value
                ? 'bg-randere-chalk text-black border-randere-chalk font-bold'
                : 'border-randere-border text-neutral-400 hover:text-white'
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* Stories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-[4/3] bg-neutral-900 border border-randere-border" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-mono text-randere-muted uppercase">
                    <span className="text-randere-accent">{story.contentType}</span>
                    <span>{story.readTimeMinutes} MIN READ</span>
                  </div>

                  <Link to={`/stories/${story.slug}`}>
                    <h3 className="text-lg font-bold text-white group-hover:text-randere-accent transition-colors leading-snug">
                      {story.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-neutral-400 font-light line-clamp-3 leading-relaxed">
                    {story.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-randere-border/40 mt-4 flex items-center justify-between">
                <span className="text-[10px] font-mono text-neutral-500">
                  {formatDate(story.created_at)}
                </span>
                <Link
                  to={`/stories/${story.slug}`}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-randere-accent uppercase tracking-wider group-hover:underline"
                >
                  READ ESSAY <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
