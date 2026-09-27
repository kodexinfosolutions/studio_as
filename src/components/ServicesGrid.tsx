import Link from 'next/link';

export default function ServicesGrid({ services }: { services: any[] }) {
  if (!services?.length) return null;
  return (
    <section className="bg-paper px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-xs uppercase tracking-widest text-gold">What We Offer</p>
        <h2 className="mt-3 text-center font-serif text-3xl md:text-5xl">Our Services</h2>
        <div className="mt-16 grid gap-px overflow-hidden bg-black/10 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link key={s.id} href={s.ctaUrl || '/contact'} className="group relative flex aspect-[4/5] items-end overflow-hidden bg-black">
              {s.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.imageUrl} alt={s.title} className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-90" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="relative z-10 p-8">
                <h3 className="font-serif text-2xl text-white">{s.title}</h3>
                <p className="mt-2 max-w-xs text-sm text-white/70 opacity-0 transition group-hover:opacity-100">{s.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
