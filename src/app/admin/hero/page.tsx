'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/admin/ImageUploader';

export default function HeroAdminPage() {
  const [hero, setHero] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/hero').then((r) => r.json()).then(setHero);
  }, []);

  async function save() {
    setSaving(true);
    const { id, updatedAt, ...body } = hero;
    const res = await fetch('/api/admin/hero', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) toast.success('Hero section published');
    else toast.error('Failed to save');
  }

  if (!hero) return <p>Loading…</p>;

  const field = 'mt-1 w-full rounded border border-black/20 px-3 py-2 text-sm outline-none focus:border-black';

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      <div>
        <h1 className="font-serif text-3xl">Hero Section</h1>
        <div className="mt-8 space-y-5 rounded border border-black/10 bg-white p-6">
          <div>
            <label className="text-xs uppercase tracking-widest text-black/50">Background Image</label>
            <div className="mt-2">
              <ImageUploader
                folder="hero"
                currentUrl={hero.backgroundImageUrl}
                onUploaded={(files) => setHero({ ...hero, backgroundImageUrl: files[0].url })}
              />
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-black/50">Background Video URL (optional, overrides image)</label>
            <input className={field} value={hero.backgroundVideoUrl || ''} onChange={(e) => setHero({ ...hero, backgroundVideoUrl: e.target.value })} placeholder="https://..." />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-black/50">Heading</label>
            <input className={field} value={hero.heading} onChange={(e) => setHero({ ...hero, heading: e.target.value })} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-black/50">Subheading</label>
            <textarea className={field} rows={2} value={hero.subheading} onChange={(e) => setHero({ ...hero, subheading: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-black/50">Primary CTA Text</label>
              <input className={field} value={hero.ctaText} onChange={(e) => setHero({ ...hero, ctaText: e.target.value })} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-black/50">Primary CTA URL</label>
              <input className={field} value={hero.ctaUrl} onChange={(e) => setHero({ ...hero, ctaUrl: e.target.value })} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-black/50">Secondary CTA Text</label>
              <input className={field} value={hero.secondaryCtaText || ''} onChange={(e) => setHero({ ...hero, secondaryCtaText: e.target.value })} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-black/50">Secondary CTA URL</label>
              <input className={field} value={hero.secondaryCtaUrl || ''} onChange={(e) => setHero({ ...hero, secondaryCtaUrl: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-black/50">Overlay Intensity ({hero.overlayIntensity}%)</label>
            <input type="range" min={0} max={90} className="mt-2 w-full" value={hero.overlayIntensity} onChange={(e) => setHero({ ...hero, overlayIntensity: Number(e.target.value) })} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-black/50">Text Alignment</label>
            <select className={field} value={hero.alignment} onChange={(e) => setHero({ ...hero, alignment: e.target.value })}>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <button onClick={save} disabled={saving} className="mt-2 bg-black px-8 py-3 text-xs uppercase tracking-widest text-white hover:bg-black/80 disabled:opacity-50">
            {saving ? 'Publishing…' : 'Publish Changes'}
          </button>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-black/50">Live Preview</p>
        <div className="relative mt-2 aspect-[9/16] w-full overflow-hidden rounded bg-black">
          {hero.backgroundImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hero.backgroundImageUrl} alt="preview" className="absolute inset-0 h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-black" style={{ opacity: hero.overlayIntensity / 100 }} />
          <div
            className={`absolute inset-0 flex flex-col justify-center gap-3 p-6 text-white ${
              hero.alignment === 'left' ? 'items-start text-left' : hero.alignment === 'right' ? 'items-end text-right' : 'items-center text-center'
            }`}
          >
            <p className="font-serif text-xl leading-tight">{hero.heading}</p>
            <p className="text-xs text-white/70">{hero.subheading}</p>
            <span className="mt-2 border border-white px-4 py-1.5 text-[10px] uppercase tracking-widest">{hero.ctaText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
