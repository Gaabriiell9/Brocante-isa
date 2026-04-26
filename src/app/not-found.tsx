import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-6 py-32 text-center">
        <p className="font-display italic text-7xl md:text-8xl text-terracotta-600 mb-6">
          404
        </p>
        <h1 className="font-display text-3xl text-ink-900 mb-4">
          Cet article s'est envolé.
        </h1>
        <p className="text-ink-700 mb-10">
          La page que vous cherchez n'existe pas, ou a été supprimée.
        </p>
        <Link
          href="/"
          className="inline-block bg-ink-900 hover:bg-terracotta-600 text-cream-100 px-8 py-4 transition-colors"
        >
          Retour à la boutique
        </Link>
      </main>
      <Footer />
    </>
  );
}
