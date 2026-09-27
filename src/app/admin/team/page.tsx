'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/admin/ImageUploader';
import ConfirmButton from '@/components/admin/ConfirmButton';

const empty = { name: '', role: '', bio: '', photoUrl: '' };

export default function TeamAdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    fetch('/api/admin/team').then((r) => r.json()).then(setItems);
  }
  useEffect(load, []);

  async function save() {
    setSaving(true);
    const isNew = !editing.id;
    const res = await fetch(isNew ? '/api/admin/team' : `/api/admin/team/${editing.id}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    if (res.ok) { toast.success('Saved'); setEditing(null); load(); } else toast.error('Failed');
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/team/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Deleted'); load(); }
  }

  const field = 'mt-1 w-full rounded border border-black/20 px-3 py-2 text-sm outline-none focus:border-black';

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl">Team</h1>
        <button onClick={() => setEditing({ ...empty })} className="bg-black px-6 py-2.5 text-xs uppercase tracking-widest text-white hover:bg-black/80">+ Add Member</button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((m) => (
          <div key={m.id} className="rounded border border-black/10 bg-white p-4 text-center">
            {m.photoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.photoUrl} alt={m.name} className="mx-auto h-20 w-20 rounded-full object-cover" />
            )}
            <p className="mt-3 font-medium">{m.name}</p>
            <p className="text-xs uppercase tracking-widest text-gold">{m.role}</p>
            <div className="mt-3 flex justify-center gap-4 text-sm">
              <button onClick={() => setEditing(m)} className="text-gold hover:underline">Edit</button>
              <ConfirmButton onConfirm={() => remove(m.id)} confirmMessage={`Remove "${m.name}"?`} />
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setEditing(null)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <p className="font-serif text-xl">{editing.id ? 'Edit Member' : 'Add Member'}</p>
            <div className="mt-5 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-black/50">Name</label>
                <input className={field} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-black/50">Role</label>
                <input className={field} value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-black/50">Bio</label>
                <textarea className={field} rows={2} value={editing.bio || ''} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-black/50">Photo</label>
                <div className="mt-2">
                  <ImageUploader folder="team" currentUrl={editing.photoUrl} onUploaded={(f) => setEditing({ ...editing, photoUrl: f[0].url })} />
                </div>
              </div>
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
