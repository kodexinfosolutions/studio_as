'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useCallback } from 'react';

export default function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: any[];
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const img = images[index];

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate((index + 1) % images.length);
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + images.length) % images.length);
    },
    [index, images.length, onClose, onNavigate]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 px-4"
      >
        <button onClick={onClose} className="absolute right-6 top-6 text-3xl text-white/70 hover:text-white" aria-label="Close">
          ✕
        </button>
        <button
          onClick={() => onNavigate((index - 1 + images.length) % images.length)}
          className="absolute left-4 text-3xl text-white/50 hover:text-white md:left-8"
          aria-label="Previous"
        >
          ‹
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img.url} alt={img.altText || img.title || ''} className="max-h-[80vh] max-w-full object-contain" />
        {img.caption && <p className="mt-4 max-w-xl text-center text-sm text-white/70">{img.caption}</p>}
        <button
          onClick={() => onNavigate((index + 1) % images.length)}
          className="absolute right-4 text-3xl text-white/50 hover:text-white md:right-8"
          aria-label="Next"
        >
          ›
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
