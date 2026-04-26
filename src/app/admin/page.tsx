'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import { Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError('Identifiants incorrects.');
      setLoading(false);
      return;
    }

    router.push('/admin/dashboard');
    router.refresh();
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="block text-center font-display text-2xl text-ink-900 mb-2 hover:text-terracotta-600 transition-colors"
        >
          {process.env.NEXT_PUBLIC_SITE_NAME || "Brocante d'Isabella"}
        </Link>
        <p className="text-center text-[11px] uppercase tracking-[0.2em] text-ink-500 mb-12">
          Espace admin
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-[11px] uppercase tracking-[0.18em] text-ink-500 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-cream-50 border border-ink-800/15 focus:border-ink-900 focus:bg-white transition-colors outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[11px] uppercase tracking-[0.18em] text-ink-500 mb-2"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-cream-50 border border-ink-800/15 focus:border-ink-900 focus:bg-white transition-colors outline-none"
            />
          </div>

          {error && (
            <p className="text-sm text-terracotta-600 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink-900 hover:bg-terracotta-600 text-cream-100 px-6 py-4 transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Se connecter
          </button>
        </form>
      </div>
    </main>
  );
}
