'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function TestimonialCarousel({ testimonials }: { testimonials: any[] }) {
  if (!testimonials?.length) return null;
  return (
    <section className="dark-section px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs uppercase tracking-widest text-gold">Kind Words</p>
        <h2 className="mt-3 font-serif text-3xl md:text-5xl">Client Testimonials</h2>
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          loop={testimonials.length > 1}
          className="mt-14"
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.id}>
              <div className="flex flex-col items-center gap-5 px-6 pb-12">
                {t.photoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.photoUrl} alt={t.name} className="h-16 w-16 rounded-full object-cover" />
                )}
                <div className="text-gold">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
                <p className="max-w-2xl font-serif text-xl italic text-white/90">&ldquo;{t.review}&rdquo;</p>
                <p className="text-sm uppercase tracking-widest text-white/50">{t.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
