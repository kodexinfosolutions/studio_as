import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { prisma } from '@/lib/prisma';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const dynamic = 'force-dynamic';


const serif = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });
const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } }).catch(() => null);
  return {
    title: settings?.seoTitle || settings?.studioName || 'Photography Studio',
    description: settings?.seoDescription || settings?.tagline || '',
    icons: settings?.faviconUrl ? [{ url: settings.faviconUrl }] : undefined,
    openGraph: settings?.ogImageUrl ? { images: [settings.ogImageUrl] } : undefined,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans">
        {children}
        <Toaster position="top-right" />
        <SpeedInsights />
      </body>
    </html>
  );
}
