'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function HomepageSectionsAdminPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  function load() {
    fetch('/api/admin/homepage-sections').then((r) => r.json()).then(setSections);
  }
  useEffect(load, []);

  function toggle(id: string) {
    setSections(sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  }

  function move(index: number, direction: -1 | 1) {
    const arr = [...sections];
    const target = index + direction;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    setSections(arr);
  }

  async function save() {
    setSaving(true);
    const payload = sections.map((s, i) => ({ id: s.id, enabled: s.enabled, order: i }));
    const res = await fetch('/api/admin/homepage-sections', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sections: payload }),
    });
    setSaving(false);
    if (res.ok) toast.success('Homepage layout published');
    else toast.error('Failed to save');
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-serif text-3xl">Homepage Sections</h1>
      <p className="mt-2 text-sm text-black/50">Toggle sections on/off and reorder how they appear on the homepage.</p>

      <div className="mt-8 space-y-2">
        {sections.map((s, i) => (
          <div key={s.id} className="flex items-center justify-between rounded border border-black/10 bg-white p-4">
            <div className="flex items-center gap-3">
              <span className="text-black/30">{i + 1}.</span>
              <span className={s.enabled ? '' : 'text-black/30 line-through'}>{s.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="text-black/50 disabled:opacity-20">↑</button>
              <button onClick={() => move(i, 1)} disabled={i === sections.length - 1} className="text-black/50 disabled:opacity-20">↓</button>
              <label className="relative ml-2 inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" checked={s.enabled} onChange={() => toggle(s.id)} />
                <div className="h-5 w-9 rounded-full bg-black/20 transition peer-checked:bg-black" />
                <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-4" />
              </label>
            </div>
          </div>
        ))}
      </div>

      <button onClick={save} disabled={saving} className="mt-6 bg-black px-8 py-3 text-xs uppercase tracking-widest text-white hover:bg-black/80 disabled:opacity-50">
        {saving ? 'Publishing…' : 'Publish Layout'}
      </button>
    </div>
  );
}
