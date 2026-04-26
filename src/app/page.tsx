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
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data: products, error } = await query;

  const items: Product[] = error ? [] : products || [];
  const available = items.filter((p) => p.status !== 'sold');

  return (
    <>
      <Header />

      <section className="border-b border-ink-800/10 py-4 md:py-5">
        <div className="max-w-[1600px] mx-auto px-4 md:px-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-ink-500 whitespace-nowrap shrink-0">
              — {available.length} ARTICLE{available.length > 1 ? 'S' : ''}
            </p>
            <CategoryFilter />
          </div>
        </div>
      </section>

      <main className="max-w-[1600px] mx-auto px-4 md:px-12 py-10 md:py-12">
        {items.length > 0 ? (
          <section
            id="products"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-5 gap-y-12 md:gap-y-16"
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
