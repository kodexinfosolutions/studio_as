'use client';
import { useState } from 'react';
import { getEmbedUrl } from '@/lib/utils';

export default function VideoGrid({ videos }: { videos: any[] }) {
  const [active, setActive] = useState<any>(null);
  if (!videos?.length) return null;
  return (
    <section className="bg-black px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-xs uppercase tracking-widest text-gold">Films</p>
        <h2 className="mt-3 text-center font-serif text-3xl text-white md:text-5xl">Featured Films</h2>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <button key={v.id} onClick={() => setActive(v)} className="group relative aspect-video overflow-hidden bg-white/5">
              {v.thumbnailUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.thumbnailUrl} alt={v.title} className="h-full w-full object-cover opacity-70 transition group-hover:scale-105 group-hover:opacity-90" />
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/60 text-white transition group-hover:bg-white group-hover:text-black">▶</div>
              </div>
              <p className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 p-4 text-left text-sm text-white">{v.title}</p>
            </button>
          ))}
        </div>
      </div>
      {active && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4" onClick={() => setActive(null)}>
          <div className="aspect-video w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <iframe src={getEmbedUrl(active.videoUrl)} className="h-full w-full" allow="autoplay; fullscreen" allowFullScreen />
          </div>
          <button onClick={() => setActive(null)} className="absolute right-6 top-6 text-3xl text-white/70 hover:text-white">✕</button>
        </div>
      )}
    </section>
  );
}
