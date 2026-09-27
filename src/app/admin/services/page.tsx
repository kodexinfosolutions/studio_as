'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/admin/ImageUploader';
import ConfirmButton from '@/components/admin/ConfirmButton';

const empty = { title: '', description: '', imageUrl: '', priceLabel: '', ctaText: 'Enquire', ctaUrl: '/contact', published: true };

export default function ServicesAdminPage() {
  const [services, setServices] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    fetch('/api/admin/services').then((r) => r.json()).then(setServices);
  }
  useEffect(load, []);

  async function save() {
    setSaving(true);
    const isNew = !editing.id;
    const res = await fetch(isNew ? '/api/admin/services' : `/api/admin/services/${editing.id}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    if (res.ok) {
      toast.success(isNew ? 'Service added' : 'Service updated');
      setEditing(null);
      load();
    } else toast.error('Failed to save');
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Service deleted');
      load();
    }
  }

  const field = 'mt-1 w-full rounded border border-black/20 px-3 py-2 text-sm outline-none focus:border-black';

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl">Services</h1>
        <button onClick={() => setEditing({ ...empty })} className="bg-black px-6 py-2.5 text-xs uppercase tracking-widest text-white hover:bg-black/80">
          + Add Service
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div key={s.id} className="overflow-hidden rounded border border-black/10 bg-white">
            {s.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.imageUrl} alt={s.title} className="h-36 w-full object-cover" />
            )}
            <div className="p-4">
              <p className="font-medium">{s.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-black/50">{s.description}</p>
              <div className="mt-3 flex gap-4">
                <button onClick={() => setEditing(s)} className="text-sm text-gold hover:underline">Edit</button>
                <ConfirmButton onConfirm={() => remove(s.id)} confirmMessage={`Delete "${s.title}"?`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setEditing(null)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <p className="font-serif text-xl">{editing.id ? 'Edit Service' : 'Add Service'}</p>
            <div className="mt-5 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-black/50">Title</label>
                <input className={field} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-black/50">Description</label>
                <textarea className={field} rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-black/50">Image</label>
                <div className="mt-2">
                  <ImageUploader folder="services" currentUrl={editing.imageUrl} onUploaded={(f) => setEditing({ ...editing, imageUrl: f[0].url })} />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-black/50">Price / Package Info (optional)</label>
                <input className={field} value={editing.priceLabel || ''} onChange={(e) => setEditing({ ...editing, priceLabel: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-black/50">CTA Text</label>
                  <input className={field} value={editing.ctaText} onChange={(e) => setEditing({ ...editing, ctaText: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-black/50">CTA URL</label>
                  <input className={field} value={editing.ctaUrl} onChange={(e) => setEditing({ ...editing, ctaUrl: e.target.value })} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
                Published (visible on website)
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
