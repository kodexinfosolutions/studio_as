import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import PortfolioMasonry from '@/components/PortfolioMasonry';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = await prisma.portfolioCategory.findUnique({
    where: { slug: params.category },
    include: { images: { orderBy: { order: 'asc' } } },
  });
  if (!category) notFound();

  const allCategories = await prisma.portfolioCategory.findMany({ orderBy: { order: 'asc' } });

  return (
    <div className="pt-32">
      <section className="px-6 py-12 text-center">
        <p className="text-xs uppercase tracking-widest text-gold">Portfolio</p>
        <h1 className="mt-3 font-serif text-4xl md:text-6xl">{category.name}</h1>
      </section>

      <section className="px-6 pb-12">
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-4">
          {allCategories.map((c) => (
            <Link
              key={c.id}
              href={`/portfolio/${c.slug}`}
              className={`border px-6 py-2 text-xs uppercase tracking-widest transition hover:border-black hover:bg-black hover:text-white ${
                c.slug === category.slug ? 'border-black bg-black text-white' : 'border-black/20'
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <PortfolioMasonry images={category.images} />
      </section>
    </div>
  );
}
