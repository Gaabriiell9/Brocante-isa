'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { CATEGORY_LABELS, type ProductCategory } from '@/types/product';

const CATEGORIES: { value: ProductCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Tout' },
  { value: 'robes', label: CATEGORY_LABELS.robes },
  { value: 'hauts', label: CATEGORY_LABELS.hauts },
  { value: 'bas', label: CATEGORY_LABELS.bas },
  { value: 'chaussures', label: CATEGORY_LABELS.chaussures },
  { value: 'sacs', label: CATEGORY_LABELS.sacs },
  { value: 'accessoires', label: CATEGORY_LABELS.accessoires },
  { value: 'autre', label: CATEGORY_LABELS.autre },
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
    <div className="flex flex-wrap items-center">
      {CATEGORIES.flatMap((cat, i) => [
        i > 0 ? (
          <span key={`sep-${i}`} className="text-[11px] text-ink-300 mx-2 select-none">·</span>
        ) : null,
        <button
          key={cat.value}
          onClick={() => setCategory(cat.value)}
          className={clsx(
            'text-[11px] uppercase tracking-[0.2em] transition-colors duration-200',
            current === cat.value
              ? 'text-ink-900 underline underline-offset-4'
              : 'text-ink-500 hover:text-ink-900'
          )}
        >
          {cat.label.toUpperCase()}
        </button>,
      ])}
    </div>
  );
}
