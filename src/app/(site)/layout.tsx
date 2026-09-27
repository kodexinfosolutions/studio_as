import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export const dynamic = 'force-dynamic';


export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } }).catch(() => null);
  return (
    <>
      <Navbar studioName={settings?.studioName || 'Studio'} logoUrl={settings?.logoUrl} />
      <main>{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton number={settings?.whatsapp} />
    </>
  );
}
