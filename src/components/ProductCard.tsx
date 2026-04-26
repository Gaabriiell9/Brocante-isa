import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/product';
import { CATEGORY_LABELS } from '@/types/product';
import clsx from 'clsx';

interface ProductCardProps {
  product: Product;
  index?: number;
}

function formatIndex(n: number): string {
  return String(n + 1).padStart(2, '0');
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const mainImage = product.images?.[0];
  const isSold = product.status === 'sold';
  const isReserved = product.status === 'reserved';

  return (
    <Link
      href={`/product/${product.slug || product.id}`}
      className={clsx(
        'group block opacity-0 animate-fade-up',
        isSold && 'pointer-events-none'
      )}
      style={{ animationDelay: `${Math.min(index * 60, 600)}ms` }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-200 mb-3">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className={clsx(
              'object-cover transition-transform duration-700',
              'group-hover:scale-[1.02]',
              isSold && 'grayscale opacity-50'
            )}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-ink-400 text-[11px] uppercase tracking-[0.15em]">
            Sans photo
          </div>
        )}

        {(isSold || isReserved) && (
          <div className="absolute top-2 left-2">
            <span
              className={clsx(
                'inline-block px-2 py-0.5 text-[9px] uppercase tracking-[0.15em]',
                isSold && 'bg-ink-900 text-cream-100',
                isReserved && 'bg-terracotta-500 text-cream-100'
              )}
            >
              {isSold ? 'VENDU' : 'RÉSERVÉ'}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <p className="text-[10px] uppercase tracking-[0.25em] text-ink-400">
          {formatIndex(index)}
          {' · '}
          {CATEGORY_LABELS[product.category].toUpperCase()}
          {product.size && ` · ${product.size}`}
        </p>
        <h3
          className={clsx(
            'font-medium text-sm text-ink-900 leading-snug transition-all duration-300',
            'group-hover:italic'
          )}
        >
          {product.title}
        </h3>
        <p
          className={clsx(
            'font-display text-base',
            isSold ? 'line-through text-ink-400' : 'text-ink-900'
          )}
        >
          {product.price} €
        </p>
      </div>
    </Link>
  );
}
