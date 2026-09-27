import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';


export default async function AdminDashboard() {
  const [images, videos, services, testimonials, enquiries, recentImages, newLeads] = await Promise.all([
    prisma.portfolioImage.count(),
    prisma.video.count(),
    prisma.service.count(),
    prisma.testimonial.count(),
    prisma.contactSubmission.count(),
    prisma.portfolioImage.findMany({ orderBy: { createdAt: 'desc' }, take: 6 }),
    prisma.contactSubmission.findMany({ where: { status: 'New' }, orderBy: { createdAt: 'desc' }, take: 5 }),
  ]);

  const stats = [
    { label: 'Portfolio Images', value: images, href: '/admin/portfolio' },
    { label: 'Videos', value: videos, href: '/admin/videos' },
    { label: 'Services', value: services, href: '/admin/services' },
    { label: 'Testimonials', value: testimonials, href: '/admin/testimonials' },
    { label: 'Enquiries', value: enquiries, href: '/admin/contact' },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl">Dashboard</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded border border-black/10 bg-white p-6 transition hover:shadow-md">
            <p className="text-3xl font-serif">{s.value}</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-black/50">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded border border-black/10 bg-white p-6">
          <p className="text-sm font-medium">New Enquiries</p>
          <div className="mt-4 space-y-3">
            {newLeads.length === 0 && <p className="text-sm text-black/40">No new enquiries.</p>}
            {newLeads.map((l) => (
              <div key={l.id} className="flex items-center justify-between border-b border-black/5 pb-2 text-sm">
                <div>
                  <p className="font-medium">{l.name}</p>
                  <p className="text-black/50">{l.eventType || '—'}</p>
                </div>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">New</span>
              </div>
            ))}
          </div>
          <Link href="/admin/contact" className="mt-4 inline-block text-xs uppercase tracking-widest text-gold">View All →</Link>
        </div>

        <div className="rounded border border-black/10 bg-white p-6">
          <p className="text-sm font-medium">Recent Uploads</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {recentImages.map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={img.id} src={img.url} alt={img.title || ''} className="aspect-square w-full rounded object-cover" />
            ))}
            {recentImages.length === 0 && <p className="col-span-3 text-sm text-black/40">No uploads yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
