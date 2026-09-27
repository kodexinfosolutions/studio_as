export default function InstagramSection({ instagramUrl }: { instagramUrl?: string | null }) {
  if (!instagramUrl) return null;
  return (
    <section className="bg-black px-6 py-16 text-center">
      <p className="text-xs uppercase tracking-widest text-gold">Follow Along</p>
      <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="mt-3 block font-serif text-3xl text-white hover:text-gold">
        @studio on Instagram
      </a>
    </section>
  );
}
