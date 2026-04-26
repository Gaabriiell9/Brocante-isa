import { createClient } from '@/lib/supabase-server';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import type { Product, ProductCategory } from '@/types/product';

export const revalidate = 30; // ISR: refresh every 30s

interface PageProps {
  searchParams: { cat?: string };
}

export default async function HomePage({ searchParams }: PageProps) {
  const supabase = createClient();
  const category = searchParams.cat as ProductCategory | undefined;

  let query = supabase
    .from('products')
    .select('*')
    .order('status', { ascending: true }) // available first
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data: products, error } = await query;

  const items: Product[] = error ? [] : products || [];
  const available = items.filter((p) => p.status !== 'sold');
  const colsClass =
    available.length <= 3
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <>
      <Header />

      <section className="border-b border-ink-800/10 py-12 md:py-20">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="flex items-baseline justify-between gap-6 flex-wrap">
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-ink-900 leading-none tracking-tight">
              Édition <em className="italic text-terracotta-600">№01</em>
            </h1>
            <p className="text-[11px] uppercase tracking-[0.25em] text-ink-500">
              Printemps 2026 · Bordeaux + Guyane
            </p>
          </div>
        </div>
      </section>

      <div className="border-b border-ink-800/10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <span className="text-[11px] uppercase tracking-[0.15em] text-ink-500 shrink-0">
            — {items.length} ARTICLE{items.length !== 1 ? 'S' : ''}
          </span>
          <CategoryFilter />
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-6 md:px-10 py-12">
        {items.length > 0 ? (
          <section
            id="products"
            className={`grid gap-x-5 gap-y-16 md:gap-y-20 ${colsClass}`}
          >
            {items.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </section>
        ) : (
          <section className="py-32 md:py-48 text-center">
            <p className="font-display italic text-6xl md:text-8xl text-ink-300 leading-none mb-8">
              Bientôt.
            </p>
            <p className="text-[11px] uppercase tracking-[0.25em] text-ink-500">
              {category
                ? `Aucune pièce dans cette catégorie pour l'instant`
                : `Les premières pièces arrivent`}
            </p>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
