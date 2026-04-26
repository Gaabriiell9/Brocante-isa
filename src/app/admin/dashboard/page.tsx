import Link from 'next/link';
import Image from 'next/image';
import { Plus, LogOut, Pencil } from 'lucide-react';
import { createClient } from '@/lib/supabase-server';
import { LogoutButton } from '@/components/LogoutButton';
import {
  CATEGORY_LABELS,
  STATUS_LABELS,
  type Product,
} from '@/types/product';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  const items: Product[] = products || [];
  const stats = {
    total: items.length,
    available: items.filter((p) => p.status === 'available').length,
    reserved: items.filter((p) => p.status === 'reserved').length,
    sold: items.filter((p) => p.status === 'sold').length,
    revenue: items
      .filter((p) => p.status === 'sold')
      .reduce((sum, p) => sum + Number(p.price), 0),
  };

  return (
    <main className="max-w-6xl mx-auto px-6 md:px-10 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-ink-800/10">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-terracotta-600 mb-1">
            Espace admin
          </p>
          <h1 className="font-display text-3xl text-ink-900">
            Tableau de bord
          </h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/"
            className="px-4 py-2 text-sm border border-ink-800/15 hover:bg-cream-200 transition-colors"
          >
            Voir le site
          </Link>
          <LogoutButton />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total" value={stats.total} />
        <StatCard
          label="Disponibles"
          value={stats.available}
          accent="text-sage-600"
        />
        <StatCard
          label="Réservés"
          value={stats.reserved}
          accent="text-terracotta-600"
        />
        <StatCard
          label="Vendus"
          value={`${stats.revenue.toFixed(0)} €`}
          subtitle={`${stats.sold} articles`}
        />
      </div>

      {/* Add button */}
      <div className="mb-8">
        <Link
          href="/admin/new"
          className="inline-flex items-center gap-2 bg-ink-900 hover:bg-terracotta-600 text-cream-100 px-6 py-3 transition-colors duration-300"
        >
          <Plus className="w-4 h-4" />
          Ajouter un article
        </Link>
      </div>

      {/* Products list */}
      {items.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-ink-800/20">
          <p className="font-display italic text-2xl text-ink-700 mb-2">
            Aucun article pour l'instant.
          </p>
          <p className="text-sm text-ink-500">
            Cliquez sur "Ajouter un article" pour commencer.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((product) => (
            <Link
              key={product.id}
              href={`/admin/edit/${product.id}`}
              className="flex items-center gap-4 p-3 bg-cream-50 hover:bg-cream-200 border border-ink-800/5 transition-colors group"
            >
              <div className="relative w-16 h-16 bg-cream-200 flex-shrink-0">
                {product.images?.[0] && (
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-ink-900 truncate">
                  {product.title}
                </h3>
                <p className="text-xs text-ink-500">
                  {CATEGORY_LABELS[product.category]}
                  {product.size && ` · ${product.size}`}
                  {product.brand && ` · ${product.brand}`}
                </p>
              </div>

              <div className="text-right">
                <p className="font-display text-lg text-ink-900">
                  {product.price} €
                </p>
                <span
                  className={`text-[10px] uppercase tracking-wider ${
                    product.status === 'available'
                      ? 'text-sage-600'
                      : product.status === 'reserved'
                      ? 'text-terracotta-600'
                      : 'text-ink-400'
                  }`}
                >
                  {STATUS_LABELS[product.status]}
                </span>
              </div>

              <Pencil className="w-4 h-4 text-ink-400 group-hover:text-ink-900 transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
  subtitle,
  accent = 'text-ink-900',
}: {
  label: string;
  value: string | number;
  subtitle?: string;
  accent?: string;
}) {
  return (
    <div className="bg-cream-50 border border-ink-800/5 px-5 py-4">
      <p className="text-[10px] uppercase tracking-[0.18em] text-ink-500 mb-1">
        {label}
      </p>
      <p className={`font-display text-2xl ${accent}`}>{value}</p>
      {subtitle && <p className="text-xs text-ink-500 mt-1">{subtitle}</p>}
    </div>
  );
}
