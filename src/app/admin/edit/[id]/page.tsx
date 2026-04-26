import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase-server';
import { ProductForm } from '@/components/ProductForm';

interface PageProps {
  params: { id: string };
}

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: PageProps) {
  const supabase = createClient();

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .maybeSingle();

  if (!product) notFound();

  return (
    <main className="max-w-3xl mx-auto px-6 md:px-10 py-10">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900 mb-8 transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Retour au tableau de bord
      </Link>

      <p className="text-[11px] uppercase tracking-[0.2em] text-terracotta-600 mb-2">
        Modifier
      </p>
      <h1 className="font-display text-3xl text-ink-900 mb-10">
        {product.title}
      </h1>

      <ProductForm mode="edit" product={product} />
    </main>
  );
}
