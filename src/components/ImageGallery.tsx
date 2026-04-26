'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-cream-200 flex items-center justify-center text-ink-400">
        Aucune photo
      </div>
    );
  }

  const next = () => setActiveIndex((i) => (i + 1) % images.length);
  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-[3/4] bg-cream-200 overflow-hidden">
        <Image
          key={activeIndex}
          src={images[activeIndex]}
          alt={`${alt} — photo ${activeIndex + 1}`}
          fill
          priority={activeIndex === 0}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover animate-fade-in"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Photo précédente"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-cream-100/90 hover:bg-cream-100 text-ink-900 flex items-center justify-center backdrop-blur-sm transition-all hover:scale-105 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              aria-label="Photo suivante"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-cream-100/90 hover:bg-cream-100 text-ink-900 flex items-center justify-center backdrop-blur-sm transition-all hover:scale-105 shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Aller à la photo ${i + 1}`}
                  className={clsx(
                    'h-1.5 rounded-full transition-all duration-300',
                    i === activeIndex
                      ? 'bg-ink-900 w-6'
                      : 'bg-ink-900/30 w-1.5 hover:bg-ink-900/50'
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActiveIndex(i)}
              className={clsx(
                'relative aspect-square overflow-hidden bg-cream-200 transition-all',
                i === activeIndex
                  ? 'ring-2 ring-ink-900 ring-offset-2 ring-offset-cream-100'
                  : 'opacity-70 hover:opacity-100'
              )}
            >
              <Image
                src={img}
                alt={`Miniature ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
