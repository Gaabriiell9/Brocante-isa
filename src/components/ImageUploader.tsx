'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase-browser';
import { Upload, X, Loader2, GripVertical } from 'lucide-react';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUploader({
  images,
  onChange,
  maxImages = 8,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragIndex = useRef<number | null>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);

    const remaining = maxImages - images.length;
    const filesToUpload = Array.from(files).slice(0, remaining);

    if (filesToUpload.length === 0) {
      setError(`Maximum ${maxImages} photos.`);
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const uploaded: string[] = [];

    try {
      for (let i = 0; i < filesToUpload.length; i++) {
        setProgress({ current: i + 1, total: filesToUpload.length });
        const file = filesToUpload[i];

        // Validate
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} n'est pas une image.`);
        }
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`${file.name} dépasse 10 MB.`);
        }

        // Generate unique filename
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

        const { data, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filename, file, {
            cacheControl: '31536000',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(data.path);

        uploaded.push(publicUrl);
      }

      onChange([...images, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload.');
    } finally {
      setUploading(false);
      setProgress(null);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = async (index: number) => {
    const url = images[index];
    onChange(images.filter((_, i) => i !== index));

    // Best-effort: remove from storage
    try {
      const supabase = createClient();
      const path = url.split('/product-images/')[1];
      if (path) {
        await supabase.storage.from('product-images').remove([path]);
      }
    } catch {
      // Silent fail — image is already removed from product
    }
  };

  const handleDragStart = (i: number) => {
    dragIndex.current = i;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (i: number) => {
    if (dragIndex.current === null || dragIndex.current === i) return;
    const newImages = [...images];
    const [moved] = newImages.splice(dragIndex.current, 1);
    newImages.splice(i, 0, moved);
    onChange(newImages);
    dragIndex.current = null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] uppercase tracking-[0.18em] text-ink-500">
          Photos ({images.length}/{maxImages})
        </label>
        {images.length > 0 && (
          <p className="text-[11px] text-ink-400">
            Glissez pour réorganiser · Première = principale
          </p>
        )}
      </div>

      {/* Existing images */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((url, i) => (
            <div
              key={url}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(i)}
              className="relative aspect-square bg-cream-200 group cursor-move"
            >
              <Image
                src={url}
                alt={`Photo ${i + 1}`}
                fill
                sizes="160px"
                className="object-cover"
              />
              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-ink-900 text-cream-100 text-[9px] uppercase tracking-wider px-1.5 py-0.5">
                  Principale
                </span>
              )}
              <span className="absolute top-1 left-1 bg-cream-100/80 text-ink-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-3 h-3" />
              </span>
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="absolute top-1 right-1 bg-cream-100/90 hover:bg-terracotta-500 hover:text-cream-100 text-ink-900 p-1 transition-colors"
                aria-label="Supprimer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {images.length < maxImages && (
        <label
          className={`block border-2 border-dashed border-ink-800/20 hover:border-ink-900 transition-colors p-8 text-center cursor-pointer ${
            uploading ? 'pointer-events-none opacity-60' : ''
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={(e) => handleUpload(e.target.files)}
            className="sr-only"
            disabled={uploading}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-ink-700">
              <Loader2 className="w-6 h-6 animate-spin" />
              <p className="text-sm">
                Téléversement {progress?.current}/{progress?.total}…
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-ink-500">
              <Upload className="w-6 h-6" />
              <p className="text-sm font-medium text-ink-900">
                Cliquer pour ajouter des photos
              </p>
              <p className="text-xs">JPG, PNG, WebP — max 10 MB par photo</p>
            </div>
          )}
        </label>
      )}

      {error && <p className="text-sm text-terracotta-600">{error}</p>}
    </div>
  );
}
