import type { Metadata } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Brocante d'Isabella";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    'Vide-dressing curaté avant grand voyage — pièces sélectionnées, prix doux.',
  openGraph: {
    title: SITE_NAME,
    description:
      'Vide-dressing curaté avant grand voyage — pièces sélectionnées, prix doux.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="font-body relative">
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
