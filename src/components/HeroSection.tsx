'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection({ hero }: { hero: any }) {
  const align = hero?.alignment === 'left' ? 'items-start text-left' : hero?.alignment === 'right' ? 'items-end text-right' : 'items-center text-center';
  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black">
      {hero?.backgroundVideoUrl ? (
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-90"
          src={hero.backgroundVideoUrl}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={hero?.backgroundImageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2400'}
          alt="Hero"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black" style={{ opacity: (hero?.overlayIntensity ?? 45) / 100 }} />
      <div className={`relative z-10 flex w-full max-w-4xl flex-col gap-6 px-6 ${align}`}>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="font-serif text-4xl leading-tight text-white md:text-6xl lg:text-7xl"
        >
          {hero?.heading}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          className="max-w-xl text-base text-white/80 md:text-lg"
        >
          {hero?.subheading}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
          className="mt-2 flex flex-wrap gap-4"
        >
          {hero?.ctaText && (
            <Link href={hero.ctaUrl || '/portfolio'} className="border border-white px-8 py-3 text-xs uppercase tracking-widest text-white transition hover:bg-white hover:text-black">
              {hero.ctaText}
            </Link>
          )}
          {hero?.secondaryCtaText && (
            <Link href={hero.secondaryCtaUrl || '/contact'} className="bg-gold px-8 py-3 text-xs uppercase tracking-widest text-white transition hover:opacity-90">
              {hero.secondaryCtaText}
            </Link>
          )}
        </motion.div>
      </div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/60"
      >
        <div className="h-9 w-5 rounded-full border border-white/50 p-1">
          <div className="h-1.5 w-1.5 rounded-full bg-white" />
        </div>
      </motion.div>
    </section>
  );
}
