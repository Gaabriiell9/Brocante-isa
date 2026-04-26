'use client';

import { MessageCircle, Mail } from 'lucide-react';
import type { Product } from '@/types/product';

interface ContactButtonsProps {
  product: Product;
}

export function ContactButtons({ product }: ContactButtonsProps) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  const isAvailable = product.status === 'available';

  const message = encodeURIComponent(
    `Bonjour ! Je suis intéressé(e) par "${product.title}" (${product.price} €). Est-il toujours disponible ?`
  );

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${message}`
    : null;

  const emailUrl = email
    ? `mailto:${email}?subject=${encodeURIComponent(`À propos de ${product.title}`)}&body=${message}`
    : null;

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

  return (
    <div className="space-y-3">
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-ink-900 hover:bg-terracotta-600 text-cream-100 px-6 py-4 flex items-center justify-center gap-3 transition-colors duration-300 group"
        >
          <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-medium tracking-wide">
            Contacter sur WhatsApp
          </span>
        </a>
      )}

      {emailUrl && (
        <a
          href={emailUrl}
          className="w-full border border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-cream-100 px-6 py-4 flex items-center justify-center gap-3 transition-colors duration-300"
        >
          <Mail className="w-5 h-5" />
          <span className="font-medium tracking-wide">Envoyer un email</span>
        </a>
      )}
    </div>
  );
}
