'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/admin/ImageUploader';
import ConfirmButton from '@/components/admin/ConfirmButton';

export default function PortfolioAdminPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [renaming, setRenaming] = useState<{ id: string; name: string } | null>(null);

  function load() {
    fetch('/api/admin/portfolio/categories')
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
        if (!activeCategoryId && data.length) setActiveCategoryId(data[0].id);
      });
  }
  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  const activeCategory = categories.find((c) => c.id === activeCategoryId);

  async function addCategory() {
    if (!newCategoryName.trim()) return;
    const res = await fetch('/api/admin/portfolio/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategoryName.trim() }),
    });
    if (res.ok) {
      toast.success('Category created');
      setNewCategoryName('');
      load();
    }
  }

  async function renameCategory() {
    if (!renaming) return;
    const res = await fetch(`/api/admin/portfolio/categories/${renaming.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: renaming.name }),
    });
    if (res.ok) {
      toast.success('Category renamed');
      setRenaming(null);
      load();
    }
  }

  async function deleteCategory(id: string) {
    const res = await fetch(`/api/admin/portfolio/categories/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Category deleted');
      if (activeCategoryId === id) setActiveCategoryId(null);
      load();
    }
  }

  async function onUploaded(files: { url: string; publicId: string }[]) {
    if (!activeCategoryId) return;
    for (const f of files) {
      await fetch('/api/admin/portfolio/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: f.url, publicId: f.publicId, categoryId: activeCategoryId }),
      });
    }
    toast.success('Images added to gallery');
    load();
  }

  async function toggleFeatured(img: any) {
    await fetch(`/api/admin/portfolio/images/${img.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !img.featured }),
    });
    load();
  }

  async function updateCaption(img: any, title: string) {
    await fetch(`/api/admin/portfolio/images/${img.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
  }

  async function deleteImage(id: string) {
    const res = await fetch(`/api/admin/portfolio/images/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Image deleted');
      load();
    }
  }

  async function moveImage(index: number, direction: -1 | 1) {
    if (!activeCategory) return;
    const imgs = [...activeCategory.images];
    const target = index + direction;
    if (target < 0 || target >= imgs.length) return;
    [imgs[index], imgs[target]] = [imgs[target], imgs[index]];
    const payload = imgs.map((img, i) => ({ id: img.id, order: i }));
    await fetch('/api/admin/portfolio/images', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: payload }),
    });
    load();
  }

  return (
    <div>
      <h1 className="font-serif text-3xl">Portfolio</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Categories sidebar */}
        <div className="rounded border border-black/10 bg-white p-4">
          <p className="text-xs uppercase tracking-widest text-black/50">Categories</p>
          <div className="mt-3 space-y-1">
            {categories.map((c) => (
              <div
                key={c.id}
                className={`flex items-center justify-between rounded px-3 py-2 text-sm ${
                  c.id === activeCategoryId ? 'bg-black text-white' : 'hover:bg-black/5'
                }`}
              >
                {renaming && renaming.id === c.id ? (
                  <input
                    autoFocus
                    className="w-full bg-transparent text-sm outline-none"
                    value={renaming.name}
                    onChange={(e) => setRenaming({ id: c.id, name: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && renameCategory()}
                    onBlur={renameCategory}
                  />
                ) : (
                  <button className="flex-1 text-left" onClick={() => setActiveCategoryId(c.id)}>
                    {c.name} <span className="opacity-50">({c.images.length})</span>
                  </button>
                )}
                <div className="flex gap-2 text-xs">
                  <button onClick={() => setRenaming({ id: c.id, name: c.name })} className="opacity-70 hover:opacity-100">✎</button>
                  <ConfirmButton
                    onConfirm={() => deleteCategory(c.id)}
                    label="✕"
                    confirmMessage={`Delete "${c.name}" and all its images?`}
                    className="opacity-70 hover:opacity-100"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              placeholder="New category"
              className="w-full rounded border border-black/20 px-2 py-1.5 text-sm"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCategory()}
            />
            <button onClick={addCategory} className="rounded bg-black px-3 text-white">+</button>
          </div>
        </div>

        {/* Images panel */}
        <div className="rounded border border-black/10 bg-white p-6">
          {activeCategory ? (
            <>
              <div className="flex items-center justify-between">
                <p className="font-medium">{activeCategory.name}</p>
                <p className="text-xs text-black/40">{activeCategory.images.length} images</p>
              </div>
              <div className="mt-4">
                <ImageUploader folder={`portfolio/${activeCategory.slug}`} multiple onUploaded={onUploaded} />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {activeCategory.images.map((img: any, i: number) => (
                  <div key={img.id} className="group relative overflow-hidden rounded border border-black/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.title || ''} className="aspect-square w-full object-cover" />
                    {img.featured && (
                      <span className="absolute left-2 top-2 rounded bg-gold px-2 py-0.5 text-[10px] uppercase text-white">Featured</span>
                    )}
                    <div className="absolute inset-0 flex flex-col justify-between bg-black/60 p-2 opacity-0 transition group-hover:opacity-100">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => moveImage(i, -1)} className="rounded bg-white/90 px-1.5 text-xs">←</button>
                        <button onClick={() => moveImage(i, 1)} className="rounded bg-white/90 px-1.5 text-xs">→</button>
                      </div>
                      <div className="space-y-1">
                        <input
                          defaultValue={img.title || ''}
                          placeholder="Caption"
                          onBlur={(e) => updateCaption(img, e.target.value)}
                          className="w-full rounded bg-white/90 px-1.5 py-1 text-xs"
                        />
                        <div className="flex justify-between">
                          <button onClick={() => toggleFeatured(img)} className="rounded bg-white/90 px-1.5 py-0.5 text-[10px]">
                            {img.featured ? 'Unfeature' : 'Feature'}
                          </button>
                          <ConfirmButton onConfirm={() => deleteImage(img.id)} label="Delete" className="rounded bg-red-500 px-1.5 py-0.5 text-[10px] text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-black/40">Create a category to get started.</p>
          )}
        </div>
      </div>
    </div>
  );
}
