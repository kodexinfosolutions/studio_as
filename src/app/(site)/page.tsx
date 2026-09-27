import { prisma } from '@/lib/prisma';
import HeroSection from '@/components/HeroSection';
import ServicesGrid from '@/components/ServicesGrid';
import PortfolioMasonry from '@/components/PortfolioMasonry';
import AboutSection from '@/components/AboutSection';
import VideoGrid from '@/components/VideoGrid';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import InstagramSection from '@/components/InstagramSection';
import ContactCTA from '@/components/ContactCTA';

export const revalidate = 0;

const sectionComponents: Record<string, (data: any) => JSX.Element | null> = {
  hero: (d) => <HeroSection hero={d.hero} />,
  services: (d) => <ServicesGrid services={d.services} />,
  portfolio: (d) => (
    <section className="bg-paper px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-xs uppercase tracking-widest text-gold">Our Work</p>
        <h2 className="mt-3 text-center font-serif text-3xl md:text-5xl">Featured Portfolio</h2>
        <div className="mt-16">
          <PortfolioMasonry images={d.featuredImages} />
        </div>
      </div>
    </section>
  ),
  about: (d) => <AboutSection about={d.about} />,
  videos: (d) => <VideoGrid videos={d.videos} />,
  testimonials: (d) => <TestimonialCarousel testimonials={d.testimonials} />,
  instagram: (d) => <InstagramSection instagramUrl={d.settings?.instagramUrl} />,
  contact: () => <ContactCTA />,
};

export default async function HomePage() {
  const [hero, services, featuredImages, about, videos, testimonials, settings, sections] = await Promise.all([
    prisma.hero.findUnique({ where: { id: 'singleton' } }),
    prisma.service.findMany({ where: { published: true }, orderBy: { order: 'asc' } }),
    prisma.portfolioImage.findMany({ where: { featured: true }, orderBy: { order: 'asc' }, take: 9 }),
    prisma.aboutContent.findUnique({ where: { id: 'singleton' } }),
    prisma.video.findMany({ where: { featured: true }, orderBy: { order: 'asc' }, take: 6 }),
    prisma.testimonial.findMany({ where: { enabled: true }, orderBy: { order: 'asc' } }),
    prisma.siteSettings.findUnique({ where: { id: 'singleton' } }),
    prisma.homepageSection.findMany({ orderBy: { order: 'asc' } }),
  ]);

  const data = { hero, services, featuredImages, about, videos, testimonials, settings };

  return (
    <>
      {sections.filter((s) => s.enabled).map((s) => {
        const Comp = sectionComponents[s.id];
        return Comp ? <div key={s.id}>{Comp(data)}</div> : null;
      })}
    </>
  );
}
