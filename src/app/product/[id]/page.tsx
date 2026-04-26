import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase-server';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ImageGallery } from '@/components/ImageGallery';
import { ContactButtons } from '@/components/ContactButtons';
import {
  CATEGORY_LABELS,
  STATUS_LABELS,
  CONDITION_LABELS,
  type Product,
} from '@/types/product';

export const revalidate = 30;

interface PageProps {
  params: { id: string };
}

async function getProduct(slugOrId: string): Promise<Product | null> {
  const supabase = createClient();

  // Try slug first
  const { data: bySlug } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slugOrId)
    .maybeSingle();

  if (bySlug) return bySlug;

  // Fallback to id (UUID)
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      slugOrId
    );
  if (!isUuid) return null;

  const { data: byId } = await supabase
    .from('products')
    .select('*')
    .eq('id', slugOrId)
    .maybeSingle();

  return byId;
}

export async function generateMetadata({ params }: PageProps) {
  const product = await getProduct(params.id);
  if (!product) return { title: 'Article introuvable' };
  return {
    title: product.title,
    description: product.description?.slice(0, 160) || `${product.title} — ${product.price} €`,
    openGraph: {
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  return (
    <>
      <Header />

      <main className="max-w-6xl mx-auto px-4 md:px-12 py-10 md:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900 mb-8 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Retour à la boutique
        </Link>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <div className="opacity-0 animate-fade-in">
            <ImageGallery images={product.images} alt={product.title} />
          </div>

          {/* Details */}
          <div
            className="opacity-0 animate-fade-up md:pt-4"
            style={{ animationDelay: '120ms' }}
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-terracotta-600 mb-3">
              {CATEGORY_LABELS[product.category]}
            </p>

            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-ink-900 leading-[1.1] mb-6">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-4 mb-8">
              <p
                className={`font-display text-3xl ${
                  product.status === 'sold'
                    ? 'line-through text-ink-400'
                    : 'text-ink-900'
                }`}
              >
                {product.price} €
              </p>
              {product.status !== 'available' && (
                <span
                  className={`text-xs uppercase tracking-[0.15em] px-3 py-1 ${
                    product.status === 'sold'
                      ? 'bg-ink-900 text-cream-100'
                      : 'bg-terracotta-500 text-cream-100'
                  }`}
                >
                  {STATUS_LABELS[product.status]}
                </span>
              )}
            </div>

            {product.description && (
              <div className="prose prose-sm max-w-none text-ink-700 mb-8 whitespace-pre-line leading-relaxed">
                {product.description}
              </div>
            )}

            {/* Specs */}
            <dl className="grid grid-cols-2 gap-y-4 gap-x-6 mb-10 pt-6 border-t border-ink-800/10">
              {product.brand && (
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-ink-500 mb-1">
                    Marque
                  </dt>
                  <dd className="text-ink-900">{product.brand}</dd>
                </div>
              )}
              {product.size && (
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-ink-500 mb-1">
                    Taille
                  </dt>
                  <dd className="text-ink-900">{product.size}</dd>
                </div>
              )}
              {product.color && (
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-ink-500 mb-1">
                    Couleur
                  </dt>
                  <dd className="text-ink-900">{product.color}</dd>
                </div>
              )}
              {product.condition && (
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-ink-500 mb-1">
                    État
                  </dt>
                  <dd className="text-ink-900">
                    {CONDITION_LABELS[product.condition]}
                  </dd>
                </div>
              )}
            </dl>

            {/* Contact */}
            <ContactButtons product={product} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
