import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit2, Trash2, Check, X, Eye, Package, ExternalLink } from 'lucide-react';
import { api } from '../lib/api.js';
import { Product, Category } from '../types/index.js';
import { formatKES } from '../lib/utils.js';

const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  categoryId: z.string().min(1, 'Category is required'),
  productType: z.enum(['CURATED', 'REMADE', 'ARTED', 'ACCESSORY']),
  price: z.coerce.number().positive('Price must be greater than 0'),
  size: z.string().min(1, 'Size is required'),
  condition: z.string().min(1, 'Condition is required'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SOLD', 'ARCHIVED']),
  stockQuantity: z.coerce.number().int().min(0),
  oneOfOne: z.boolean(),
  description: z.string().min(10, 'Description is required'),
  originalGarmentDescription: z.string().optional(),
  transformationDescription: z.string().optional(),
  materials: z.string().optional(),
  careInstructions: z.string().optional(),
  imageUrl: z.string().url('Primary image URL is required'),
  imageUrl2: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productType: 'REMADE',
      status: 'PUBLISHED',
      oneOfOne: true,
      stockQuantity: 1,
      condition: 'Grade A - Studio Spec',
    },
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.get('/products?limit=100&status=ALL'),
        api.get('/products/categories'),
      ]);
      if (prodRes.success) setProducts(prodRes.data);
      if (catRes.success) setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    reset({
      name: '',
      categoryId: categories[1]?.id || '',
      productType: 'REMADE',
      price: 7500,
      size: 'L',
      condition: 'Grade A - Restored Vintage',
      status: 'PUBLISHED',
      stockQuantity: 1,
      oneOfOne: true,
      description: '',
      originalGarmentDescription: '',
      transformationDescription: '',
      materials: '100% Cotton Twill',
      careInstructions: 'Cold gentle wash. Line dry.',
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80',
      imageUrl2: '',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    reset({
      name: p.name,
      categoryId: p.category_id,
      productType: p.product_type,
      price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
      size: p.size,
      condition: p.condition,
      status: p.status,
      stockQuantity: p.stock_quantity,
      oneOfOne: p.one_of_one,
      description: p.description,
      originalGarmentDescription: p.original_garment_description || '',
      transformationDescription: p.transformation_description || '',
      materials: p.materials || '',
      careInstructions: p.care_instructions || '',
      imageUrl: p.images?.[0]?.url || '',
      imageUrl2: p.images?.[1]?.url || '',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setFormError(null);
      const images = [{ url: data.imageUrl, isPrimary: true, sortOrder: 0 }];
      if (data.imageUrl2) {
        images.push({ url: data.imageUrl2, isPrimary: false, sortOrder: 1 });
      }

      const payload = {
        name: data.name,
        categoryId: data.categoryId,
        productType: data.productType,
        price: data.price,
        size: data.size,
        condition: data.condition,
        status: data.status,
        stockQuantity: data.stockQuantity,
        oneOfOne: data.oneOfOne,
        description: data.description,
        originalGarmentDescription: data.originalGarmentDescription || null,
        transformationDescription: data.transformationDescription || null,
        materials: data.materials || null,
        careInstructions: data.careInstructions || null,
        images,
      };

      if (editingProduct) {
        await api.patch(`/products/${editingProduct.id}`, payload);
      } else {
        await api.post('/products', payload);
      }

      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed');
    }
  };

  const handleToggleSold = async (p: Product) => {
    const newStatus = p.status === 'SOLD' ? 'PUBLISHED' : 'SOLD';
    const newStock = newStatus === 'SOLD' ? 0 : 1;
    await api.patch(`/products/${p.id}`, { status: newStatus, stockQuantity: newStock });
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this garment from archive?')) {
      await api.delete(`/products/${id}`);
      loadData();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-randere-border gap-4">
        <div>
          <span className="text-xs font-mono tracking-mega text-randere-accent uppercase block mb-1">
            [ INVENTORY &amp; RELEASES ]
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
            CATALOGUE MANAGEMENT ({products.length})
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-randere-accent text-black px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          ADD NEW PIECE
        </button>
      </div>

      {/* Table */}
      <div className="border border-randere-border bg-[#101013] overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-neutral-900 border-b border-randere-border text-neutral-400 uppercase">
            <tr>
              <th className="p-4">IMAGE</th>
              <th className="p-4">GARMENT SPEC</th>
              <th className="p-4">TYPE</th>
              <th className="p-4">PRICE</th>
              <th className="p-4">STATUS</th>
              <th className="p-4">STOCK</th>
              <th className="p-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-randere-border/60">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-neutral-900/40 transition-colors">
                <td className="p-4">
                  <img
                    src={p.images?.[0]?.url || '/placeholder.jpg'}
                    alt={p.name}
                    className="w-12 h-14 object-cover bg-neutral-800 border border-neutral-700"
                  />
                </td>
                <td className="p-4">
                  <span className="font-bold text-white uppercase block">{p.name}</span>
                  <span className="text-[11px] text-neutral-500">
                    SIZE: {p.size} // {p.one_of_one ? '1-OF-1' : 'MULTI-STOCK'}
                  </span>
                </td>
                <td className="p-4 text-neutral-300 uppercase">{p.product_type}</td>
                <td className="p-4 text-white font-bold">{formatKES(p.price)}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 text-[10px] uppercase font-bold ${
                      p.status === 'PUBLISHED'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : p.status === 'SOLD'
                        ? 'bg-neutral-800 text-neutral-400'
                        : 'bg-amber-950 text-amber-400'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-neutral-300">{p.stock_quantity}</td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleToggleSold(p)}
                    className="px-2 py-1 text-[10px] uppercase bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white"
                  >
                    {p.status === 'SOLD' ? 'MARK AVAILABLE' : 'MARK SOLD'}
                  </button>
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-1.5 text-neutral-400 hover:text-white"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Creation / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="bg-[#121215] border border-randere-border w-full max-w-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl text-xs font-mono">
            <div className="flex items-center justify-between pb-4 border-b border-randere-border">
              <span className="text-randere-accent uppercase tracking-widest font-bold">
                {editingProduct ? 'EDIT ARCHIVE PIECE' : 'REGISTER NEW ARCHIVE PIECE'}
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-950/60 border border-red-700 text-red-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-neutral-400 mb-1">GARMENT NAME *</label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="e.g. R-09 Hand-Painted Chore Vest"
                  className="w-full bg-neutral-900 border border-randere-border p-2.5 text-white focus:outline-none focus:border-randere-accent"
                />
                {errors.name && <span className="text-red-400">{errors.name.message}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">CATEGORY *</label>
                  <select
                    {...register('categoryId')}
                    className="w-full bg-neutral-900 border border-randere-border p-2.5 text-white focus:outline-none focus:border-randere-accent"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">PRODUCT TYPE *</label>
                  <select
                    {...register('productType')}
                    className="w-full bg-neutral-900 border border-randere-border p-2.5 text-white focus:outline-none focus:border-randere-accent"
                  >
                    <option value="CURATED">CURATED (Original Vintage)</option>
                    <option value="REMADE">REMADE (Structural Rework)</option>
                    <option value="ARTED">ARTED (Hand-Painted Artwork)</option>
                    <option value="ACCESSORY">ACCESSORY (Zero-Waste Object)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">PRICE (KES) *</label>
                  <input
                    type="number"
                    {...register('price')}
                    className="w-full bg-neutral-900 border border-randere-border p-2.5 text-white focus:outline-none focus:border-randere-accent"
                  />
                  {errors.price && <span className="text-red-400">{errors.price.message}</span>}
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">TAGGED SIZE *</label>
                  <input
                    type="text"
                    {...register('size')}
                    placeholder="e.g. L, 32, OS"
                    className="w-full bg-neutral-900 border border-randere-border p-2.5 text-white focus:outline-none focus:border-randere-accent"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">STATUS *</label>
                  <select
                    {...register('status')}
                    className="w-full bg-neutral-900 border border-randere-border p-2.5 text-white focus:outline-none focus:border-randere-accent"
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="SOLD">SOLD</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">STOCK QUANTITY</label>
                  <input
                    type="number"
                    {...register('stockQuantity')}
                    className="w-full bg-neutral-900 border border-randere-border p-2.5 text-white focus:outline-none focus:border-randere-accent"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('oneOfOne')}
                      className="text-randere-accent"
                    />
                    <span className="text-neutral-300">ONE-OF-ONE (UNIQUE PIECE)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">PRIMARY IMAGE URL *</label>
                <input
                  type="url"
                  {...register('imageUrl')}
                  placeholder="https://..."
                  className="w-full bg-neutral-900 border border-randere-border p-2.5 text-white focus:outline-none focus:border-randere-accent"
                />
                {errors.imageUrl && <span className="text-red-400">{errors.imageUrl.message}</span>}
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">SECONDARY HOVER IMAGE URL (OPTIONAL)</label>
                <input
                  type="url"
                  {...register('imageUrl2')}
                  placeholder="https://..."
                  className="w-full bg-neutral-900 border border-randere-border p-2.5 text-white focus:outline-none focus:border-randere-accent"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">GARMENT DESCRIPTION *</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full bg-neutral-900 border border-randere-border p-2.5 text-white focus:outline-none focus:border-randere-accent"
                />
                {errors.description && <span className="text-red-400">{errors.description.message}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">ORIGINAL FOUND SOURCE</label>
                  <textarea
                    {...register('originalGarmentDescription')}
                    rows={2}
                    placeholder="Where was it found, original style..."
                    className="w-full bg-neutral-900 border border-randere-border p-2 text-white focus:outline-none focus:border-randere-accent"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">TRANSFORMATION SPEC</label>
                  <textarea
                    {...register('transformationDescription')}
                    rows={2}
                    placeholder="What did the studio change, cut, or paint..."
                    className="w-full bg-neutral-900 border border-randere-border p-2 text-white focus:outline-none focus:border-randere-accent"
                  />
                </div>
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
                  {editingProduct ? 'UPDATE SPEC' : 'PUBLISH PIECE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
