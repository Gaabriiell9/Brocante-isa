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

  return (
    <>
      <Header />

      <div className="border-t border-b border-ink-800/10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-3 flex items-center justify-between gap-6">
          <span className="text-[11px] uppercase tracking-[0.2em] text-ink-500 shrink-0">
            — {items.length} ARTICLE{items.length !== 1 ? 'S' : ''}
          </span>
          <CategoryFilter />
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-6 md:px-10 py-12">
        {items.length > 0 ? (
          <section
            id="products"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-16 md:gap-y-20"
          >
            {items.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </section>
        ) : (
          <section className="py-20">
            <p className="text-[13px] uppercase tracking-[0.2em] text-ink-500">
              Aucun article dans cette catégorie.
            </p>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
