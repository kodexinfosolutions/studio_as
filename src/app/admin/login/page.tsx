'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      toast.error('Invalid email or password');
    } else {
      router.push('/admin');
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0b0c] px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded bg-white p-8 shadow-xl">
        <p className="text-center font-serif text-2xl tracking-widest2">STUDIO CMS</p>
        <p className="mt-1 text-center text-xs uppercase tracking-widest text-black/40">Admin Login</p>
        <div className="mt-8 space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-black/20 px-4 py-3 text-sm outline-none focus:border-black"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-black/20 px-4 py-3 text-sm outline-none focus:border-black"
          />
        </div>
        <button
          disabled={loading}
          type="submit"
          className="mt-6 w-full rounded bg-black py-3 text-xs uppercase tracking-widest text-white transition hover:bg-black/80 disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
