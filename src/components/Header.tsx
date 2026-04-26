import Link from 'next/link';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Brocante d'Isabella";

export function Header() {
  return (
    <header className="bg-cream-100/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto px-4 md:px-12 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-lg md:text-xl tracking-tight text-ink-900 hover:text-terracotta-600 transition-colors"
        >
          {SITE_NAME}
        </Link>
        <Link
          href="/admin"
          className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-ink-500 hover:text-ink-900 transition-colors"
        >
          Admin
        </Link>
      </div>
    </header>
  );
}
