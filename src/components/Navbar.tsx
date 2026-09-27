'use client';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/videos', label: 'Films' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar({ studioName, logoUrl }: { studioName: string; logoUrl?: string | null }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/60 to-transparent">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3 text-white">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={studioName} className="h-9 w-auto" />
          ) : (
            <span className="font-serif text-xl tracking-widest2">{studioName}</span>
          )}
        </Link>
        <nav className="hidden gap-10 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-xs uppercase tracking-widest text-white/90 hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>
        <button onClick={() => setOpen(!open)} className="text-white md:hidden" aria-label="Menu">
          <div className="space-y-1.5">
            <span className="block h-px w-6 bg-white" />
            <span className="block h-px w-6 bg-white" />
          </div>
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-black md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 pb-6">
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-3 text-sm uppercase tracking-widest text-white/90">
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
