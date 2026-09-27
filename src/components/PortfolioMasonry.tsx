'use client';
import { useState } from 'react';
import Lightbox from './Lightbox';

export default function PortfolioMasonry({ images }: { images: any[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  if (!images?.length) {
    return <p className="py-24 text-center text-sm text-muted">No images in this category yet.</p>;
  }
  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActiveIndex(i)}
            className="group relative block w-full overflow-hidden bg-black/5 text-left"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.altText || img.title || 'Portfolio image'}
              loading="lazy"
              className="w-full transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100">
              {img.title && <p className="p-4 text-sm text-white">{img.title}</p>}
            </div>
          </button>
        ))}
      </div>
      {activeIndex !== null && (
        <Lightbox
          images={images}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={setActiveIndex}
        />
      )}
    </>
  );
}
