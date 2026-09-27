'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/admin/ImageUploader';

export default function AboutAdminPage() {
  const [about, setAbout] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/about').then((r) => r.json()).then(setAbout);
  }, []);

  async function save() {
    setSaving(true);
    const { id, updatedAt, ...body } = about;
    const res = await fetch('/api/admin/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) toast.success('About page published');
    else toast.error('Failed to save');
  }

  if (!about) return <p>Loading…</p>;
  const field = 'mt-1 w-full rounded border border-black/20 px-3 py-2 text-sm outline-none focus:border-black';

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl">About Page</h1>
      <div className="mt-8 space-y-5 rounded border border-black/10 bg-white p-6">
        <div>
          <label className="text-xs uppercase tracking-widest text-black/50">Studio Image</label>
          <div className="mt-2">
            <ImageUploader folder="about" currentUrl={about.heroImageUrl} onUploaded={(f) => setAbout({ ...about, heroImageUrl: f[0].url })} />
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-black/50">Story Title</label>
          <input className={field} value={about.storyTitle} onChange={(e) => setAbout({ ...about, storyTitle: e.target.value })} />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-black/50">Story Body</label>
          <textarea className={field} rows={5} value={about.storyBody} onChange={(e) => setAbout({ ...about, storyBody: e.target.value })} />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-black/50">Mission Title</label>
          <input className={field} value={about.missionTitle} onChange={(e) => setAbout({ ...about, missionTitle: e.target.value })} />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-black/50">Mission Body</label>
          <textarea className={field} rows={4} value={about.missionBody} onChange={(e) => setAbout({ ...about, missionBody: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-black/50">Years Experience</label>
            <input type="number" className={field} value={about.yearsExperience} onChange={(e) => setAbout({ ...about, yearsExperience: Number(e.target.value) })} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-black/50">Weddings Shot</label>
            <input type="number" className={field} value={about.weddingsShot} onChange={(e) => setAbout({ ...about, weddingsShot: Number(e.target.value) })} />
          </div>
        </div>
        <p className="text-xs text-black/40">Manage team members and studio locations from the Team page.</p>
        <button onClick={save} disabled={saving} className="bg-black px-8 py-3 text-xs uppercase tracking-widest text-white hover:bg-black/80 disabled:opacity-50">
          {saving ? 'Publishing…' : 'Publish Changes'}
        </button>
      </div>
    </div>
  );
}
