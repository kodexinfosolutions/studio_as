import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@yourstudio.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const hashed = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, password: hashed, name: 'Studio Admin' },
  });

  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      studioName: 'LUMENFRAME STUDIOS',
      tagline: 'Cinematic wedding photography & films',
      phone: '+91 90000 00000',
      whatsapp: '+91 90000 00000',
      email: 'hello@lumenframe.demo',
      address: 'Chennai, Tamil Nadu, India',
      businessHours: 'Mon–Sat, 10:00 AM – 7:00 PM',
      instagramUrl: 'https://instagram.com',
      seoTitle: 'LUMENFRAME STUDIOS — Cinematic Wedding Photography',
      seoDescription: 'A boutique photography and film studio crafting timeless, cinematic wedding stories.',
    },
  });

  await prisma.hero.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      heading: 'Timeless Stories, Beautifully Told',
      subheading: 'A boutique photography & film studio for weddings that deserve to be remembered.',
      backgroundImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2400',
      ctaText: 'View Portfolio',
      ctaUrl: '/portfolio',
      secondaryCtaText: 'Enquire Now',
      secondaryCtaUrl: '/contact',
    },
  });

  await prisma.aboutContent.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      storyTitle: 'Our Story',
      storyBody: 'Founded on the belief that every love story deserves cinematic treatment, our studio has spent years perfecting the art of visual storytelling — demo content, replace via Admin → About.',
      missionTitle: 'Our Mission',
      missionBody: 'To create timeless, emotionally honest imagery that feels like memory, not performance.',
      yearsExperience: 8,
      weddingsShot: 240,
      heroImageUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=2000',
    },
  });

  const sections = [
    { id: 'hero', label: 'Hero', order: 0 },
    { id: 'services', label: 'Featured Services', order: 1 },
    { id: 'portfolio', label: 'Featured Portfolio', order: 2 },
    { id: 'about', label: 'About Studio', order: 3 },
    { id: 'videos', label: 'Featured Videos', order: 4 },
    { id: 'testimonials', label: 'Testimonials', order: 5 },
    { id: 'instagram', label: 'Instagram / Social', order: 6 },
    { id: 'contact', label: 'Contact CTA', order: 7 },
  ];
  for (const s of sections) {
    await prisma.homepageSection.upsert({
      where: { id: s.id },
      update: {},
      create: { ...s, enabled: true },
    });
  }

  const services = [
    { title: 'Wedding Photography', slug: 'wedding-photography', description: 'Full-day cinematic coverage of your wedding, candid and directed.', order: 0 },
    { title: 'Wedding Films', slug: 'wedding-films', description: 'Cinematic short films that capture the emotion of your day.', order: 1 },
    { title: 'Pre-Wedding', slug: 'pre-wedding', description: 'Editorial-style pre-wedding shoots at destinations you love.', order: 2 },
    { title: 'Baby Photography', slug: 'baby-photography', description: 'Gentle, joyful sessions capturing your little one.', order: 3 },
    { title: 'Maternity Photography', slug: 'maternity-photography', description: 'Elegant maternity portraits that celebrate this chapter.', order: 4 },
  ];
  for (const s of services) {
    await prisma.service.upsert({ where: { slug: s.slug }, update: {}, create: s });
  }

  const categories = [
    { name: 'Wedding', slug: 'wedding', order: 0 },
    { name: 'Pre-Wedding', slug: 'pre-wedding', order: 1 },
    { name: 'Baby', slug: 'baby', order: 2 },
    { name: 'Maternity', slug: 'maternity', order: 3 },
  ];
  for (const c of categories) {
    await prisma.portfolioCategory.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  const wedding = await prisma.portfolioCategory.findUnique({ where: { slug: 'wedding' } });
  if (wedding) {
    const existing = await prisma.portfolioImage.count({ where: { categoryId: wedding.id } });
    if (existing === 0) {
      const demoUrls = [
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1600',
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1600',
        'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=1600',
      ];
      for (let i = 0; i < demoUrls.length; i++) {
        await prisma.portfolioImage.create({
          data: { url: demoUrls[i], categoryId: wedding.id, order: i, title: `Wedding demo ${i + 1}`, featured: i === 0 },
        });
      }
    }
  }

  await prisma.testimonial.createMany({
    data: [
      { name: 'Ananya & Vikram', review: 'Demo content — replace via Admin → Testimonials. They made our wedding day feel effortless.', rating: 5, order: 0 },
      { name: 'Priya S.', review: 'Demo content — the maternity shoot photos are ones we will treasure forever.', rating: 5, order: 1 },
    ],
  });

  console.log('Seed complete. Admin login:', adminEmail, '/', adminPassword);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
