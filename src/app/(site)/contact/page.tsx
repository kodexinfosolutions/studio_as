import { prisma } from '@/lib/prisma';
import ContactForm from '@/components/ContactForm';

export const dynamic = 'force-dynamic';


export default async function ContactPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  return (
    <div className="pt-32">
      <section className="px-6 pb-12 text-center">
        <p className="text-xs uppercase tracking-widest text-gold">Get In Touch</p>
        <h1 className="mt-3 font-serif text-4xl md:text-6xl">Contact</h1>
      </section>

      <section className="mx-auto grid max-w-6xl gap-16 px-6 pb-24 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-2xl">Send an Enquiry</h2>
          <div className="mt-8">
            <ContactForm />
          </div>
        </div>
        <div className="space-y-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold">Phone</p>
            <p className="mt-1 text-lg">{settings?.phone}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-gold">Email</p>
            <p className="mt-1 text-lg">{settings?.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-gold">Address</p>
            <p className="mt-1 text-lg">{settings?.address}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-gold">Business Hours</p>
            <p className="mt-1 text-lg">{settings?.businessHours}</p>
          </div>
          {settings?.mapEmbedUrl && (
            <div className="aspect-video w-full overflow-hidden">
              <iframe src={settings.mapEmbedUrl} className="h-full w-full border-0" loading="lazy" />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
