import type { Metadata } from 'next';
import { Bebas_Neue, Inter, Parisienne } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import 'keen-slider/keen-slider.min.css';
import './globals.css';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const parisienne = Parisienne({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-parisienne',
});

export const metadata: Metadata = {
  title: 'Multimark Motos | Tu concesionario de confianza',
  description:
    'Encontrá tu moto ideal. Las mejores marcas: Honda, Motomel, Zanella, Corven, Keller y Guerrero. 100% Financiada.',
  keywords: [
    'motos',
    'concesionario',
    'financiación',
    'Honda',
    'Motomel',
    'Zanella',
    'Corven',
    'Keller',
    'Guerrero',
  ],
  openGraph: {
    title: 'Multimark Motos | Tu concesionario de confianza',
    description: 'Encontrá tu moto ideal. Las mejores marcas. 100% Financiada.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${bebasNeue.variable} ${inter.variable} ${parisienne.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
