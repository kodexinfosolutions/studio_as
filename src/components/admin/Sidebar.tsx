'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const items = [
  { href: '/admin', label: 'Dashboard', icon: '◇' },
  { href: '/admin/hero', label: 'Hero', icon: '▭' },
  { href: '/admin/services', label: 'Services', icon: '✦' },
  { href: '/admin/portfolio', label: 'Portfolio', icon: '▦' },
  { href: '/admin/videos', label: 'Videos', icon: '▶' },
  { href: '/admin/testimonials', label: 'Testimonials', icon: '❝' },
  { href: '/admin/about', label: 'About Page', icon: '𝓲' },
  { href: '/admin/team', label: 'Team', icon: '◎' },
  { href: '/admin/contact', label: 'Enquiries', icon: '✉' },
  { href: '/admin/homepage', label: 'Homepage Sections', icon: '≣' },
  { href: '/admin/settings', label: 'Website Settings', icon: '⚙' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex h-screen w-64 flex-col justify-between border-r border-black/10 bg-white">
      <div>
        <div className="border-b border-black/10 px-6 py-6">
          <p className="font-serif text-lg tracking-widest2">STUDIO CMS</p>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded px-3 py-2 text-sm transition ${
                  active ? 'bg-black text-white' : 'text-black/70 hover:bg-black/5'
                }`}
              >
                <span className="w-4 text-center">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-black/10 p-3">
        <Link href="/" target="_blank" className="block rounded px-3 py-2 text-sm text-black/60 hover:bg-black/5">
          ↗ View Website
        </Link>
        <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="mt-1 block w-full rounded px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">
          Sign Out
        </button>
      </div>
    </aside>
  );
}
