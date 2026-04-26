import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/product';
import { CATEGORY_LABELS } from '@/types/product';
import clsx from 'clsx';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const mainImage = product.images?.[0];
  const isAvailable = product.status === 'available';
  const isUnavailable = product.status === 'reserved' || product.status === 'sold';

  return (
    <Link
      href={`/product/${product.slug || product.id}`}
      className={clsx(
        'group block opacity-0 animate-fade-up',
        isUnavailable && 'pointer-events-none'
      )}
      style={{ animationDelay: `${Math.min(index * 60, 600)}ms` }}
    >
      <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-cream-200 mb-3 md:mb-4">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className={clsx(
              'object-cover transition-all duration-700',
              isAvailable && 'group-hover:scale-[1.02]',
              isUnavailable && 'grayscale opacity-50'
            )}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-ink-400 text-[11px] uppercase tracking-[0.15em]">
            Sans photo
          </div>
        )}

        {isUnavailable && (
          <div className="absolute top-3 left-3">
            <span className="inline-block px-3 py-1 text-[10px] uppercase tracking-[0.15em] font-medium bg-ink-900 text-cream-100">
              {product.status === 'sold' ? 'Vendu' : 'Réservé'}
            </span>
          </div>
        )}
      </div>

      <div className={clsx('flex flex-col gap-0.5 md:gap-1', isUnavailable && 'opacity-50')}>
        <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] text-ink-400">
          {String(index + 1).padStart(2, '0')}
          {' · '}
          {CATEGORY_LABELS[product.category]}
          {product.size && ` · ${product.size}`}
        </p>
        <h3 className={clsx(
          'font-medium text-[13px] md:text-sm text-ink-900 leading-tight transition-all duration-300',
          isAvailable && 'group-hover:italic'
        )}>
          {product.title}
        </h3>
        <p className={clsx(
          'font-display text-sm md:text-base text-ink-900',
          product.status === 'sold' && 'line-through'
        )}>
          {product.price} €
        </p>
      </div>
    </Link>
  );
}
