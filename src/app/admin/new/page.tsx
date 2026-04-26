import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { ProductForm } from '@/components/ProductForm';

export default function NewProductPage() {
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
        Nouvel article
      </p>
      <h1 className="font-display text-3xl text-ink-900 mb-10">
        Ajouter une pièce à la boutique
      </h1>

      <ProductForm mode="create" />
    </main>
  );
}
