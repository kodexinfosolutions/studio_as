import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';


export default async function AboutPage() {
  const [about, team, locations] = await Promise.all([
    prisma.aboutContent.findUnique({ where: { id: 'singleton' } }),
    prisma.teamMember.findMany({ orderBy: { order: 'asc' } }),
    prisma.location.findMany({ orderBy: { order: 'asc' } }),
  ]);

  return (
    <div className="pt-32">
      <section className="px-6 py-16 text-center">
        <p className="text-xs uppercase tracking-widest text-gold">About Us</p>
        <h1 className="mt-3 font-serif text-4xl md:text-6xl">{about?.storyTitle}</h1>
      </section>

      {about?.heroImageUrl && (
        <div className="mx-auto mb-20 max-w-6xl px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={about.heroImageUrl} alt="Studio" className="aspect-[16/9] w-full object-cover" />
        </div>
      )}

      <section className="mx-auto max-w-3xl px-6 pb-20 text-center leading-relaxed text-black/70">
        <p>{about?.storyBody}</p>
      </section>

      <section className="dark-section px-6 py-20 text-center">
        <h2 className="font-serif text-3xl">{about?.missionTitle}</h2>
        <p className="mx-auto mt-6 max-w-2xl text-white/70">{about?.missionBody}</p>
        <div className="mt-14 flex justify-center gap-16">
          <div>
            <p className="font-serif text-5xl text-gold">{about?.yearsExperience}+</p>
            <p className="mt-2 text-xs uppercase tracking-widest text-white/50">Years Experience</p>
          </div>
          <div>
            <p className="font-serif text-5xl text-gold">{about?.weddingsShot}+</p>
            <p className="mt-2 text-xs uppercase tracking-widest text-white/50">Weddings Shot</p>
          </div>
        </div>
      </section>

      {team.length > 0 && (
        <section className="px-6 py-24">
          <h2 className="text-center font-serif text-3xl md:text-4xl">Meet the Team</h2>
          <div className="mx-auto mt-14 grid max-w-5xl gap-10 sm:grid-cols-2 md:grid-cols-3">
            {team.map((m) => (
              <div key={m.id} className="text-center">
                {m.photoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.photoUrl} alt={m.name} className="mx-auto h-40 w-40 rounded-full object-cover" />
                )}
                <p className="mt-4 font-serif text-lg">{m.name}</p>
                <p className="text-xs uppercase tracking-widest text-gold">{m.role}</p>
                {m.bio && <p className="mt-2 text-sm text-black/60">{m.bio}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {locations.length > 0 && (
        <section className="bg-paper px-6 py-20 text-center">
          <h2 className="font-serif text-3xl">Studio Locations</h2>
          <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
            {locations.map((l) => (
              <div key={l.id}>
                <p className="font-serif text-lg">{l.name}</p>
                <p className="mt-1 text-sm text-black/60">{l.address}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
