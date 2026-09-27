'use client';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import ConfirmButton from '@/components/admin/ConfirmButton';
import { formatDate } from '@/lib/utils';

const statuses = ['New', 'Contacted', 'Converted', 'Closed'];
const statusColors: Record<string, string> = {
  New: 'bg-amber-100 text-amber-700',
  Contacted: 'bg-blue-100 text-blue-700',
  Converted: 'bg-green-100 text-green-700',
  Closed: 'bg-black/10 text-black/50',
};

export default function ContactAdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  function load() {
    fetch('/api/admin/contact').then((r) => (r.ok ? r.json() : [])).then(setItems);
  }
  useEffect(load, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/contact/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/contact/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Deleted'); load(); }
  }

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchesSearch = `${i.name} ${i.phone} ${i.email} ${i.eventType}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || i.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  return (
    <div>
      <h1 className="font-serif text-3xl">Enquiries</h1>

      <div className="mt-6 flex flex-wrap gap-3">
        <input placeholder="Search name, phone, email…" className="rounded border border-black/20 px-3 py-2 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="rounded border border-black/20 px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All</option>
          {statuses.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-black/10 text-left text-xs uppercase tracking-widest text-black/40">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Event</th>
              <th className="p-4">Message</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((i) => (
              <tr key={i.id} className="border-b border-black/5">
                <td className="p-4 font-medium">{i.name}</td>
                <td className="p-4">
                  <p>{i.phone}</p>
                  <p className="text-black/40">{i.email}</p>
                </td>
                <td className="p-4">
                  <p>{i.eventType}</p>
                  <p className="text-black/40">{i.eventDate ? formatDate(i.eventDate) : ''}</p>
                </td>
                <td className="max-w-xs p-4 text-black/60">{i.message}</td>
                <td className="p-4 text-black/40">{formatDate(i.createdAt)}</td>
                <td className="p-4">
                  <select
                    value={i.status}
                    onChange={(e) => updateStatus(i.id, e.target.value)}
                    className={`rounded-full px-2 py-1 text-xs ${statusColors[i.status]}`}
                  >
                    {statuses.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-4">
                  <ConfirmButton onConfirm={() => remove(i.id)} confirmMessage={`Delete enquiry from "${i.name}"?`} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-black/40">No enquiries found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
