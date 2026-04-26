'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { CATEGORY_LABELS, type ProductCategory } from '@/types/product';

const CATEGORIES: { value: ProductCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Tout' },
  { value: 'robes', label: 'Robes' },
  { value: 'hauts', label: 'Hauts' },
  { value: 'bas', label: 'Bas' },
  { value: 'chaussures', label: 'Chaussures' },
  { value: 'sacs', label: 'Sacs' },
  { value: 'accessoires', label: 'Access.' },
  { value: 'autre', label: 'Autre' },
];

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('cat') || 'all';

  const setCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'all') {
      params.delete('cat');
    } else {
      params.set('cat', cat);
    }
    const query = params.toString();
    router.push(query ? `/?${query}` : '/', { scroll: false });
  };

  return (
    <nav className="scrollbar-none flex overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:gap-y-2">
      {CATEGORIES.map((cat, i) => (
        <span key={cat.value} className="flex items-center shrink-0">
          {i > 0 && (
            <span className="text-[11px] text-ink-300 mx-2 select-none">·</span>
          )}
          <button
            onClick={() => setCategory(cat.value)}
            className={clsx(
              'text-[11px] uppercase tracking-[0.15em] transition-colors duration-200 whitespace-nowrap',
              current === cat.value
                ? 'text-ink-900 underline underline-offset-4'
                : 'text-ink-500 hover:text-ink-900'
            )}
          >
            {cat.label.toUpperCase()}
          </button>
        </span>
      ))}
    </nav>
  );
}
