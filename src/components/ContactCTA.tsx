import Link from 'next/link';

export default function ContactCTA() {
  return (
    <section className="relative flex items-center justify-center bg-black px-6 py-28 text-center">
      <div>
        <h2 className="font-serif text-3xl text-white md:text-5xl">Let&apos;s Tell Your Story</h2>
        <p className="mx-auto mt-4 max-w-md text-white/60">Reach out and let&apos;s start planning something beautiful.</p>
        <Link href="/contact" className="mt-8 inline-block bg-gold px-10 py-4 text-xs uppercase tracking-widest text-white transition hover:opacity-90">
          Get In Touch
        </Link>
      </div>
    </section>
  );
}
