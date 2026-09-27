import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import PortfolioMasonry from '@/components/PortfolioMasonry';

export const dynamic = 'force-dynamic';


export default async function PortfolioPage() {
  const categories = await prisma.portfolioCategory.findMany({
    orderBy: { order: 'asc' },
    include: { images: { orderBy: { order: 'asc' }, take: 1 } },
  });
  const allFeatured = await prisma.portfolioImage.findMany({ orderBy: { order: 'asc' }, take: 24 });

  return (
    <div className="pt-32">
      <section className="px-6 py-12 text-center">
        <p className="text-xs uppercase tracking-widest text-gold">Our Work</p>
        <h1 className="mt-3 font-serif text-4xl md:text-6xl">Portfolio</h1>
      </section>

      <section className="px-6 pb-12">
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/portfolio/${c.slug}`}
              className="border border-black/20 px-6 py-2 text-xs uppercase tracking-widest transition hover:border-black hover:bg-black hover:text-white"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <PortfolioMasonry images={allFeatured} />
      </section>
    </div>
  );
}
