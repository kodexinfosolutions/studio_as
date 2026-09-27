'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/admin/ImageUploader';
import ConfirmButton from '@/components/admin/ConfirmButton';

const empty = { name: '', review: '', photoUrl: '', rating: 5, enabled: true };

export default function TestimonialsAdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    fetch('/api/admin/testimonials').then((r) => r.json()).then(setItems);
  }
  useEffect(load, []);

  async function save() {
    setSaving(true);
    const isNew = !editing.id;
    const res = await fetch(isNew ? '/api/admin/testimonials' : `/api/admin/testimonials/${editing.id}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    if (res.ok) { toast.success('Saved'); setEditing(null); load(); } else toast.error('Failed');
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Deleted'); load(); }
  }

  async function toggleEnabled(t: any) {
    await fetch(`/api/admin/testimonials/${t.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: !t.enabled }),
    });
    load();
  }

  const field = 'mt-1 w-full rounded border border-black/20 px-3 py-2 text-sm outline-none focus:border-black';

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl">Testimonials</h1>
        <button onClick={() => setEditing({ ...empty })} className="bg-black px-6 py-2.5 text-xs uppercase tracking-widest text-white hover:bg-black/80">+ Add Testimonial</button>
      </div>

      <div className="mt-8 space-y-3">
        {items.map((t) => (
          <div key={t.id} className="flex items-center justify-between rounded border border-black/10 bg-white p-4">
            <div className="flex items-center gap-4">
              {t.photoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.photoUrl} alt={t.name} className="h-12 w-12 rounded-full object-cover" />
              )}
              <div>
                <p className="font-medium">{t.name} <span className="text-gold">{'★'.repeat(t.rating)}</span></p>
                <p className="line-clamp-1 text-sm text-black/50">{t.review}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <button onClick={() => toggleEnabled(t)} className={t.enabled ? 'text-green-600' : 'text-black/40'}>{t.enabled ? 'Enabled' : 'Disabled'}</button>
              <button onClick={() => setEditing(t)} className="text-gold hover:underline">Edit</button>
              <ConfirmButton onConfirm={() => remove(t.id)} confirmMessage={`Delete testimonial from "${t.name}"?`} />
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setEditing(null)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <p className="font-serif text-xl">{editing.id ? 'Edit Testimonial' : 'Add Testimonial'}</p>
            <div className="mt-5 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-black/50">Client Name</label>
                <input className={field} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-black/50">Review</label>
                <textarea className={field} rows={3} value={editing.review} onChange={(e) => setEditing({ ...editing, review: e.target.value })} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-black/50">Rating</label>
                <select className={field} value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}>
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-black/50">Client Photo</label>
                <div className="mt-2">
                  <ImageUploader folder="testimonials" currentUrl={editing.photoUrl} onUploaded={(f) => setEditing({ ...editing, photoUrl: f[0].url })} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.enabled} onChange={(e) => setEditing({ ...editing, enabled: e.target.checked })} />
                Enabled (visible on website)
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 text-xs uppercase tracking-widest text-black/60">Cancel</button>
              <button onClick={save} disabled={saving} className="bg-black px-6 py-2.5 text-xs uppercase tracking-widest text-white hover:bg-black/80 disabled:opacity-50">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
