'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/admin/ImageUploader';
import ConfirmButton from '@/components/admin/ConfirmButton';
import { isYouTubeOrVimeo } from '@/lib/utils';

const empty = { title: '', description: '', videoUrl: '', thumbnailUrl: '', category: '', featured: false };

export default function VideosAdminPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    fetch('/api/admin/videos').then((r) => r.json()).then(setVideos);
  }
  useEffect(load, []);

  async function save() {
    if (editing.videoUrl && !isYouTubeOrVimeo(editing.videoUrl) && !editing.videoUrl.match(/\.(mp4|webm|mov)$/i) && !editing.videoUrl.startsWith('http')) {
      toast.error('Enter a YouTube/Vimeo URL or an uploaded video URL');
      return;
    }
    setSaving(true);
    const isNew = !editing.id;
    const res = await fetch(isNew ? '/api/admin/videos' : `/api/admin/videos/${editing.id}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    if (res.ok) {
      toast.success(isNew ? 'Video added' : 'Video updated');
      setEditing(null);
      load();
    } else toast.error('Failed to save');
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/videos/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Video deleted'); load(); }
  }

  async function toggleFeatured(v: any) {
    await fetch(`/api/admin/videos/${v.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !v.featured }),
    });
    load();
  }

  const field = 'mt-1 w-full rounded border border-black/20 px-3 py-2 text-sm outline-none focus:border-black';

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl">Videos</h1>
        <button onClick={() => setEditing({ ...empty })} className="bg-black px-6 py-2.5 text-xs uppercase tracking-widest text-white hover:bg-black/80">+ Add Video</button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v) => (
          <div key={v.id} className="overflow-hidden rounded border border-black/10 bg-white">
            {v.thumbnailUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={v.thumbnailUrl} alt={v.title} className="h-36 w-full object-cover" />
            )}
            <div className="p-4">
              <p className="font-medium">{v.title} {v.featured && <span className="ml-1 text-[10px] uppercase text-gold">Featured</span>}</p>
              <p className="mt-1 line-clamp-1 text-xs text-black/50">{v.videoUrl}</p>
              <div className="mt-3 flex gap-4 text-sm">
                <button onClick={() => setEditing(v)} className="text-gold hover:underline">Edit</button>
                <button onClick={() => toggleFeatured(v)} className="text-black/60 hover:underline">{v.featured ? 'Unfeature' : 'Feature'}</button>
                <ConfirmButton onConfirm={() => remove(v.id)} confirmMessage={`Delete "${v.title}"?`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setEditing(null)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <p className="font-serif text-xl">{editing.id ? 'Edit Video' : 'Add Video'}</p>
            <div className="mt-5 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-black/50">Title</label>
                <input className={field} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-black/50">Description</label>
                <textarea className={field} rows={2} value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-black/50">Video URL (YouTube, Vimeo, or uploaded file URL)</label>
                <input className={field} value={editing.videoUrl} onChange={(e) => setEditing({ ...editing, videoUrl: e.target.value })} placeholder="https://youtube.com/watch?v=..." />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-black/50">Or Upload a Video File</label>
                <div className="mt-2">
                  <ImageUploader folder="videos" onUploaded={(f) => setEditing({ ...editing, videoUrl: f[0].url })} />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-black/50">Thumbnail</label>
                <div className="mt-2">
                  <ImageUploader folder="video-thumbnails" currentUrl={editing.thumbnailUrl} onUploaded={(f) => setEditing({ ...editing, thumbnailUrl: f[0].url })} />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-black/50">Category</label>
                <input className={field} value={editing.category || ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="e.g. Wedding" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
                Featured on homepage
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
