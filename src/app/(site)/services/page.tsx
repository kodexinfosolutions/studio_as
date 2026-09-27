import { prisma } from '@/lib/prisma';
import ServicesGrid from '@/components/ServicesGrid';

export const dynamic = 'force-dynamic';


export default async function ServicesPage() {
  const services = await prisma.service.findMany({ where: { published: true }, orderBy: { order: 'asc' } });
  return (
    <div className="pt-32">
      <section className="px-6 pb-4 text-center">
        <p className="text-xs uppercase tracking-widest text-gold">What We Offer</p>
        <h1 className="mt-3 font-serif text-4xl md:text-6xl">Services</h1>
      </section>
      <ServicesGrid services={services} />
    </div>
  );
}
