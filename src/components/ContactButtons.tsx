'use client';

import { MessageCircle, Users } from 'lucide-react';
import type { Product } from '@/types/product';

interface ContactButtonsProps {
  product: Product;
}

export function ContactButtons({ product }: ContactButtonsProps) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
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

  const message = encodeURIComponent(
    `Bonjour Isabella,\n\nJe suis intéressé(e) par cet article :\n\n` +
    `« ${product.title} »\n` +
    `Prix : ${product.price} €\n` +
    (product.size ? `Taille : ${product.size}\n` : '') +
    (product.brand ? `Marque : ${product.brand}\n` : '') +
    `\nEst-il toujours disponible ?\n\nMerci !`
  );

  const whatsappDirectUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${message}`
    : null;

  if (!whatsappDirectUrl && !whatsappGroupUrl) return null;

  return (
    <div className="space-y-3">
      {whatsappDirectUrl && (
        <a
          href={whatsappDirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-ink-900 hover:bg-terracotta-600 text-cream-100 px-6 py-4 flex items-center justify-center gap-3 transition-colors duration-300 group"
        >
          <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-medium tracking-wide">Contacter Isabella</span>
        </a>
      )}

      {whatsappGroupUrl && (
        <a
          href={whatsappGroupUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full border border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-cream-100 px-6 py-4 flex items-center justify-center gap-3 transition-colors duration-300"
        >
          <Users className="w-5 h-5" />
          <span className="font-medium tracking-wide">
            Rejoindre le groupe WhatsApp
          </span>
        </a>
      )}

      {whatsappDirectUrl && whatsappGroupUrl && (
        <p className="text-xs text-ink-500 text-center leading-relaxed pt-2">
          Réponse rapide en privé, ou rejoignez le groupe pour découvrir toutes les pièces.
        </p>
      )}
    </div>
  );
}
