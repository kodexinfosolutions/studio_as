import Link from 'next/link';

export default function Footer({ settings }: { settings: any }) {
  return (
    <footer className="dark-section px-6 py-16">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        <div>
          <p className="font-serif text-lg tracking-widest2">{settings?.studioName || 'STUDIO'}</p>
          <p className="mt-3 text-sm text-white/60">{settings?.tagline}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-white/40">Explore</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-white/70">
            <Link href="/portfolio">Portfolio</Link>
            <Link href="/services">Services</Link>
            <Link href="/videos">Films</Link>
            <Link href="/about">About</Link>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-white/40">Contact</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-white/70">
            {settings?.phone && <a href={`tel:${settings.phone}`}>{settings.phone}</a>}
            {settings?.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
            <p>{settings?.address}</p>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-white/40">Follow</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-white/70">
            {settings?.instagramUrl && <a href={settings.instagramUrl} target="_blank">Instagram</a>}
            {settings?.facebookUrl && <a href={settings.facebookUrl} target="_blank">Facebook</a>}
            {settings?.youtubeUrl && <a href={settings.youtubeUrl} target="_blank">YouTube</a>}
          </div>
        </div>
      </div>
      <p className="mx-auto mt-14 max-w-7xl text-xs text-white/30">
        © {new Date().getFullYear()} {settings?.studioName || 'Studio'}. All rights reserved.
      </p>
    </footer>
  );
}
