import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Clock, Calendar } from 'lucide-react';
import { api } from '../lib/api.js';
import { Story } from '../types/index.js';
import { formatDate } from '../lib/utils.js';

export const StoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStory() {
      try {
        setLoading(true);
        const res = await api.get(`/stories/${slug}`);
        if (res.success && res.data) {
          setStory(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStory();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center font-mono text-xs text-randere-muted animate-pulse">
        OPENING JOURNAL ESSAY...
      </div>
    );
  }

  if (!story) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold uppercase text-white font-sans">ESSAY NOT FOUND</h2>
        <Link to="/stories" className="text-xs font-mono text-randere-accent uppercase underline">
          &larr; BACK TO STORIES
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div>
        <Link
          to="/stories"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-randere-muted hover:text-randere-accent uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          BACK TO STORIES
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 text-xs font-mono text-randere-muted uppercase">
          <span className="text-randere-accent">{story.contentType}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {story.readTimeMinutes} MIN READ
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {formatDate(story.created_at)}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-sans leading-tight">
          {story.title}
        </h1>

        <p className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed border-l-2 border-randere-accent pl-4">
          {story.excerpt}
        </p>

        <div className="pt-2 text-xs font-mono text-neutral-400">
          DISPATCH AUTHOR: <strong className="text-white">{story.author}</strong>
        </div>
      </div>

      {/* Cover Image */}
      <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-900 border border-randere-border">
        <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
      </div>

      {/* Body Content */}
      <div className="prose prose-invert max-w-none space-y-6 text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
        {story.body.split('\n\n').map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>

      {/* Tags */}
      {story.tags && story.tags.length > 0 && (
        <div className="pt-8 border-t border-randere-border flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-randere-muted uppercase mr-2">INDEXED:</span>
          {story.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-neutral-900 border border-randere-border text-xs font-mono text-neutral-300 uppercase"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};
