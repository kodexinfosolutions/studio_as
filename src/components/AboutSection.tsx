export default function AboutSection({ about }: { about: any }) {
  if (!about) return null;
  return (
    <section className="bg-paper px-6 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden">
          {about.heroImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={about.heroImageUrl} alt="Studio" className="h-full w-full object-cover" />
          )}
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-gold">About Us</p>
          <h2 className="mt-3 font-serif text-3xl md:text-5xl">{about.storyTitle}</h2>
          <p className="mt-6 text-base leading-relaxed text-black/70">{about.storyBody}</p>
          <div className="mt-10 flex gap-12">
            <div>
              <p className="font-serif text-4xl text-gold">{about.yearsExperience}+</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-black/50">Years Experience</p>
            </div>
            <div>
              <p className="font-serif text-4xl text-gold">{about.weddingsShot}+</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-black/50">Weddings Shot</p>
            </div>
          </div>
          <a href="/about" className="mt-10 inline-block border border-black px-8 py-3 text-xs uppercase tracking-widest transition hover:bg-black hover:text-white">
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
