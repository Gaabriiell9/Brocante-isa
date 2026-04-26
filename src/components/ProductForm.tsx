'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { ImageUploader } from '@/components/ImageUploader';
import { Loader2, Save, Trash2 } from 'lucide-react';
import {
  CATEGORY_LABELS,
  CONDITION_LABELS,
  STATUS_LABELS,
  type Product,
  type ProductCategory,
  type ProductCondition,
  type ProductStatus,
} from '@/types/product';

interface ProductFormProps {
  product?: Product;
  mode: 'create' | 'edit';
}

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(product?.title || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [category, setCategory] = useState<ProductCategory>(
    product?.category || 'hauts'
  );
  const [size, setSize] = useState(product?.size || '');
  const [brand, setBrand] = useState(product?.brand || '');
  const [color, setColor] = useState(product?.color || '');
  const [condition, setCondition] = useState<ProductCondition>(
    product?.condition || 'tres-bon'
  );
  const [status, setStatus] = useState<ProductStatus>(
    product?.status || 'available'
  );
  const [images, setImages] = useState<string[]>(product?.images || []);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Le titre est obligatoire.');
      return;
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError('Le prix doit être un nombre positif.');
      return;
    }
    if (images.length === 0) {
      setError('Ajoutez au moins une photo.');
      return;
    }

    setSaving(true);

    const supabase = createClient();
    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      price: priceNum,
      category,
      size: size.trim() || null,
      brand: brand.trim() || null,
      color: color.trim() || null,
      condition,
      status,
      images,
    };

    if (mode === 'create') {
      const { error: insertError } = await supabase
        .from('products')
        .insert(payload);
      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }
    } else if (product) {
      const { error: updateError } = await supabase
        .from('products')
        .update(payload)
        .eq('id', product.id);
      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
    }

    router.push('/admin/dashboard');
    router.refresh();
  };

  const handleDelete = async () => {
    if (!product) return;
    if (
      !confirm(
        `Supprimer définitivement "${product.title}" ? Cette action est irréversible.`
      )
    ) {
      return;
    }
    setDeleting(true);

    const supabase = createClient();

    // Remove images from storage
    if (product.images?.length > 0) {
      const paths = product.images
        .map((url) => url.split('/product-images/')[1])
        .filter(Boolean);
      if (paths.length > 0) {
        await supabase.storage.from('product-images').remove(paths);
      }
    }

    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id);

    if (deleteError) {
      setError(deleteError.message);
      setDeleting(false);
      return;
    }

    router.push('/admin/dashboard');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Images */}
      <ImageUploader images={images} onChange={setImages} />

      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-[11px] uppercase tracking-[0.18em] text-ink-500 mb-2"
        >
          Titre *
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Robe d'été en lin écru"
          className="w-full px-4 py-3 bg-cream-50 border border-ink-800/15 focus:border-ink-900 focus:bg-white transition-colors outline-none"
        />
      </div>

      {/* Price + Category */}
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="price"
            className="block text-[11px] uppercase tracking-[0.18em] text-ink-500 mb-2"
          >
            Prix (€) *
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="25"
            className="w-full px-4 py-3 bg-cream-50 border border-ink-800/15 focus:border-ink-900 focus:bg-white transition-colors outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-[11px] uppercase tracking-[0.18em] text-ink-500 mb-2"
          >
            Catégorie *
          </label>
          <select
            id="category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductCategory)}
            className="w-full px-4 py-3 bg-cream-50 border border-ink-800/15 focus:border-ink-900 focus:bg-white transition-colors outline-none"
          >
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Brand + Size + Color */}
      <div className="grid md:grid-cols-3 gap-5">
        <div>
          <label
            htmlFor="brand"
            className="block text-[11px] uppercase tracking-[0.18em] text-ink-500 mb-2"
          >
            Marque
          </label>
          <input
            id="brand"
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Zara, Sézane…"
            className="w-full px-4 py-3 bg-cream-50 border border-ink-800/15 focus:border-ink-900 focus:bg-white transition-colors outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="size"
            className="block text-[11px] uppercase tracking-[0.18em] text-ink-500 mb-2"
          >
            Taille
          </label>
          <input
            id="size"
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="S, 38, 40…"
            className="w-full px-4 py-3 bg-cream-50 border border-ink-800/15 focus:border-ink-900 focus:bg-white transition-colors outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="color"
            className="block text-[11px] uppercase tracking-[0.18em] text-ink-500 mb-2"
          >
            Couleur
          </label>
          <input
            id="color"
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="Bleu marine"
            className="w-full px-4 py-3 bg-cream-50 border border-ink-800/15 focus:border-ink-900 focus:bg-white transition-colors outline-none"
          />
        </div>
      </div>

      {/* Condition + Status */}
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="condition"
            className="block text-[11px] uppercase tracking-[0.18em] text-ink-500 mb-2"
          >
            État
          </label>
          <select
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value as ProductCondition)}
            className="w-full px-4 py-3 bg-cream-50 border border-ink-800/15 focus:border-ink-900 focus:bg-white transition-colors outline-none"
          >
            {Object.entries(CONDITION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="status"
            className="block text-[11px] uppercase tracking-[0.18em] text-ink-500 mb-2"
          >
            Statut
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ProductStatus)}
            className="w-full px-4 py-3 bg-cream-50 border border-ink-800/15 focus:border-ink-900 focus:bg-white transition-colors outline-none"
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-[11px] uppercase tracking-[0.18em] text-ink-500 mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Achetée en 2024, portée 2 fois. Tissu impeccable, coupe fluide…"
          className="w-full px-4 py-3 bg-cream-50 border border-ink-800/15 focus:border-ink-900 focus:bg-white transition-colors outline-none resize-y"
        />
      </div>

      {error && (
        <div className="bg-terracotta-500/10 border border-terracotta-500/30 px-4 py-3 text-sm text-terracotta-700">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse md:flex-row md:justify-between gap-3 pt-6 border-t border-ink-800/10">
        {mode === 'edit' && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving || deleting}
            className="flex items-center justify-center gap-2 px-5 py-3 text-terracotta-600 hover:text-terracotta-700 hover:bg-terracotta-500/10 transition-colors disabled:opacity-50"
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Supprimer cet article
          </button>
        )}

        <div className="flex flex-col md:flex-row gap-3 md:ml-auto">
          <button
            type="button"
            onClick={() => router.push('/admin/dashboard')}
            disabled={saving || deleting}
            className="px-6 py-3 border border-ink-800/20 hover:bg-cream-200 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving || deleting}
            className="flex items-center justify-center gap-2 bg-ink-900 hover:bg-terracotta-600 text-cream-100 px-8 py-3 transition-colors duration-300 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {mode === 'create' ? 'Publier l\'article' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </form>
  );
}
