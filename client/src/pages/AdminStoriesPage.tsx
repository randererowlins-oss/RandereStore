import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Edit2, X, BookOpen, ArrowLeftRight } from 'lucide-react';
import { api } from '../lib/api.js';
import { Story, Transformation } from '../types/index.js';

const storySchema = z.object({
  title: z.string().min(3, 'Title is required'),
  excerpt: z.string().min(10, 'Excerpt is required'),
  body: z.string().min(20, 'Body content is required'),
  coverImage: z.string().url('Cover image URL is required'),
  author: z.string().default('RANDERE Studio'),
  contentType: z.enum([
    'story',
    'transformation',
    'artist_feature',
    'style_guide',
    'behind_the_scenes',
  ]),
});

type StoryFormData = z.infer<typeof storySchema>;

export const AdminStoriesPage: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StoryFormData>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      author: 'RANDERE Studio Journal',
      contentType: 'story',
    },
  });

  const loadStories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/stories');
      if (res.success && res.data) setStories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  const onSubmit = async (data: StoryFormData) => {
    try {
      await api.post('/stories', {
        ...data,
        tags: [data.contentType, 'Studio Archive'],
        published: true,
      });
      setIsModalOpen(false);
      reset();
      loadStories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this essay?')) {
      await api.delete(`/stories/${id}`);
      loadStories();
    }
  };

  return (
    <div className="space-y-8 text-xs font-mono">
      <div className="flex items-center justify-between pb-6 border-b border-randere-border">
        <div>
          <span className="text-xs font-mono tracking-mega text-randere-accent uppercase block mb-1">
            [ EDITORIAL CMS ]
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
            JOURNAL &amp; ESSAYS ({stories.length})
          </h1>
        </div>

        <button
          onClick={() => {
            reset();
            setIsModalOpen(true);
          }}
          className="bg-randere-accent text-black px-4 py-2.5 font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          WRITE NEW STORY
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((st) => (
          <div
            key={st.id}
            className="border border-randere-border bg-[#101013] flex flex-col justify-between"
          >
            <div>
              <img
                src={st.coverImage}
                alt={st.title}
                className="w-full aspect-[16/9] object-cover bg-neutral-900"
              />
              <div className="p-4 space-y-2">
                <span className="text-[10px] text-randere-accent uppercase">
                  {st.contentType}
                </span>
                <h3 className="text-sm font-bold text-white uppercase leading-snug">
                  {st.title}
                </h3>
                <p className="text-neutral-400 font-light line-clamp-2">
                  {st.excerpt}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-randere-border/60 flex items-center justify-between">
              <span className="text-[10px] text-neutral-500">{st.author}</span>
              <button
                onClick={() => handleDelete(st.id)}
                className="text-neutral-500 hover:text-red-400 p-1"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="bg-[#121215] border border-randere-border w-full max-w-xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-randere-border">
              <span className="text-randere-accent uppercase tracking-widest font-bold">
                PUBLISH EDITORIAL STORY
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-neutral-400 mb-1">STORY TITLE *</label>
                <input
                  type="text"
                  {...register('title')}
                  placeholder="e.g. From Gikomba to Runway"
                  className="w-full bg-neutral-900 border border-randere-border p-2.5 text-white focus:outline-none focus:border-randere-accent"
                />
                {errors.title && <span className="text-red-400">{errors.title.message}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">CONTENT TYPE *</label>
                  <select
                    {...register('contentType')}
                    className="w-full bg-neutral-900 border border-randere-border p-2.5 text-white focus:outline-none focus:border-randere-accent"
                  >
                    <option value="story">Editorial Story</option>
                    <option value="transformation">Transformation Doc</option>
                    <option value="artist_feature">Artist Feature</option>
                    <option value="behind_the_scenes">Behind the Scenes</option>
                    <option value="style_guide">Style Guide</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">AUTHOR *</label>
                  <input
                    type="text"
                    {...register('author')}
                    className="w-full bg-neutral-900 border border-randere-border p-2.5 text-white focus:outline-none focus:border-randere-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">COVER IMAGE URL *</label>
                <input
                  type="url"
                  {...register('coverImage')}
                  placeholder="https://..."
                  className="w-full bg-neutral-900 border border-randere-border p-2.5 text-white focus:outline-none focus:border-randere-accent"
                />
                {errors.coverImage && <span className="text-red-400">{errors.coverImage.message}</span>}
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">EXCERPT (SHORT TEASER) *</label>
                <textarea
                  {...register('excerpt')}
                  rows={2}
                  className="w-full bg-neutral-900 border border-randere-border p-2.5 text-white focus:outline-none focus:border-randere-accent"
                />
                {errors.excerpt && <span className="text-red-400">{errors.excerpt.message}</span>}
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">BODY CONTENT *</label>
                <textarea
                  {...register('body')}
                  rows={6}
                  className="w-full bg-neutral-900 border border-randere-border p-2.5 text-white focus:outline-none focus:border-randere-accent font-sans"
                />
                {errors.body && <span className="text-red-400">{errors.body.message}</span>}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-randere-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-700 text-neutral-300 uppercase"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="bg-randere-accent text-black px-6 py-2 uppercase font-bold"
                >
                  PUBLISH ESSAY
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
