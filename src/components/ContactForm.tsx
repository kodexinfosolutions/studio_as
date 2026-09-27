'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', eventType: '', eventDate: '', message: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success("Thank you! We'll be in touch soon.");
      setForm({ name: '', phone: '', email: '', eventType: '', eventDate: '', message: '' });
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const input = 'w-full border-b border-black/20 bg-transparent py-3 text-sm outline-none focus:border-gold transition';

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
      <input required placeholder="Full Name" className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input required placeholder="Phone" className={input} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <input type="email" placeholder="Email" className={input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Event Type (e.g. Wedding)" className={input} value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} />
      <input type="date" className={input} value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} />
      <div className="md:col-span-2">
        <textarea placeholder="Tell us about your event..." rows={4} className={input} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      </div>
      <button disabled={loading} type="submit" className="md:col-span-2 mt-2 w-fit bg-black px-10 py-4 text-xs uppercase tracking-widest text-white transition hover:bg-gold disabled:opacity-50">
        {loading ? 'Sending…' : 'Send Enquiry'}
      </button>
    </form>
  );
}
