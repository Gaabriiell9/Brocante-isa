'use client';

import { MessageCircle } from 'lucide-react';
import type { Product } from '@/types/product';

interface ContactButtonsProps {
  product: Product;
}

export function ContactButtons({ product }: ContactButtonsProps) {
  const whatsappGroupUrl = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL;
  const isAvailable = product.status === 'available';

  if (!isAvailable) {
    return (
      <div className="bg-ink-900/5 border border-ink-900/10 px-5 py-4 text-center">
        <p className="text-ink-700">
          {product.status === 'sold'
            ? 'Cet article a trouvé sa nouvelle maison.'
            : 'Cet article est actuellement réservé.'}
        </p>
      </div>
    );
  }

  if (!whatsappGroupUrl) return null;

  return (
    <div className="space-y-3">
      <a
        href={whatsappGroupUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-ink-900 hover:bg-terracotta-600 text-cream-100 px-6 py-4 flex items-center justify-center gap-3 transition-colors duration-300 group"
      >
        <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="font-medium tracking-wide">
          Rejoindre le groupe WhatsApp
        </span>
      </a>

      <p className="text-xs text-ink-500 text-center leading-relaxed pt-1">
        Échangez directement avec Isabella et les autres acheteurs.
        <br />
        Mentionnez la référence de l&apos;article qui vous intéresse.
      </p>
    </div>
  );
}
