'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/admin/ImageUploader';

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<'brand' | 'contact' | 'social' | 'seo'>('brand');

  useEffect(() => {
    fetch('/api/admin/settings').then((r) => r.json()).then(setSettings);
  }, []);

  async function save() {
    setSaving(true);
    const { id, updatedAt, ...body } = settings;
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) toast.success('Settings saved');
    else toast.error('Failed to save');
  }

  if (!settings) return <p>Loading…</p>;
  const field = 'mt-1 w-full rounded border border-black/20 px-3 py-2 text-sm outline-none focus:border-black';
  const tabs = [
    { id: 'brand', label: 'Brand' },
    { id: 'contact', label: 'Contact' },
    { id: 'social', label: 'Social' },
    { id: 'seo', label: 'SEO' },
  ] as const;

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl">Website Settings</h1>

      <div className="mt-6 flex gap-2 border-b border-black/10">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-xs uppercase tracking-widest ${tab === t.id ? 'border-b-2 border-black font-medium' : 'text-black/40'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-5 rounded border border-black/10 bg-white p-6">
        {tab === 'brand' && (
          <>
            <div>
              <label className="text-xs uppercase tracking-widest text-black/50">Logo</label>
              <div className="mt-2"><ImageUploader folder="brand" currentUrl={settings.logoUrl} onUploaded={(f) => setSettings({ ...settings, logoUrl: f[0].url })} /></div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-black/50">Favicon</label>
              <div className="mt-2"><ImageUploader folder="brand" currentUrl={settings.faviconUrl} onUploaded={(f) => setSettings({ ...settings, faviconUrl: f[0].url })} /></div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-black/50">Studio Name</label>
              <input className={field} value={settings.studioName} onChange={(e) => setSettings({ ...settings, studioName: e.target.value })} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-black/50">Tagline</label>
              <input className={field} value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} />
            </div>
          </>
        )}

        {tab === 'contact' && (
          <>
            <div><label className="text-xs uppercase tracking-widest text-black/50">Phone</label><input className={field} value={settings.phone || ''} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} /></div>
            <div><label className="text-xs uppercase tracking-widest text-black/50">WhatsApp Number</label><input className={field} value={settings.whatsapp || ''} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} placeholder="+91XXXXXXXXXX" /></div>
            <div><label className="text-xs uppercase tracking-widest text-black/50">Email</label><input className={field} value={settings.email || ''} onChange={(e) => setSettings({ ...settings, email: e.target.value })} /></div>
            <div><label className="text-xs uppercase tracking-widest text-black/50">Address</label><textarea className={field} rows={2} value={settings.address || ''} onChange={(e) => setSettings({ ...settings, address: e.target.value })} /></div>
            <div><label className="text-xs uppercase tracking-widest text-black/50">Google Maps Embed URL</label><input className={field} value={settings.mapEmbedUrl || ''} onChange={(e) => setSettings({ ...settings, mapEmbedUrl: e.target.value })} placeholder="https://www.google.com/maps/embed?..." /></div>
            <div><label className="text-xs uppercase tracking-widest text-black/50">Business Hours</label><input className={field} value={settings.businessHours || ''} onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })} /></div>
          </>
        )}

        {tab === 'social' && (
          <>
            <div><label className="text-xs uppercase tracking-widest text-black/50">Instagram URL</label><input className={field} value={settings.instagramUrl || ''} onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })} /></div>
            <div><label className="text-xs uppercase tracking-widest text-black/50">Facebook URL</label><input className={field} value={settings.facebookUrl || ''} onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })} /></div>
            <div><label className="text-xs uppercase tracking-widest text-black/50">YouTube URL</label><input className={field} value={settings.youtubeUrl || ''} onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })} /></div>
            <div><label className="text-xs uppercase tracking-widest text-black/50">LinkedIn URL</label><input className={field} value={settings.linkedinUrl || ''} onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })} /></div>
          </>
        )}

        {tab === 'seo' && (
          <>
            <div><label className="text-xs uppercase tracking-widest text-black/50">Website Title</label><input className={field} value={settings.seoTitle || ''} onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })} /></div>
            <div><label className="text-xs uppercase tracking-widest text-black/50">Meta Description</label><textarea className={field} rows={3} value={settings.seoDescription || ''} onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })} /></div>
            <div><label className="text-xs uppercase tracking-widest text-black/50">Keywords (comma separated)</label><input className={field} value={settings.seoKeywords || ''} onChange={(e) => setSettings({ ...settings, seoKeywords: e.target.value })} /></div>
            <div>
              <label className="text-xs uppercase tracking-widest text-black/50">OG Image</label>
              <div className="mt-2"><ImageUploader folder="seo" currentUrl={settings.ogImageUrl} onUploaded={(f) => setSettings({ ...settings, ogImageUrl: f[0].url })} /></div>
            </div>
          </>
        )}

        <button onClick={save} disabled={saving} className="bg-black px-8 py-3 text-xs uppercase tracking-widest text-white hover:bg-black/80 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
