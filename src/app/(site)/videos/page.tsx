import { prisma } from '@/lib/prisma';
import VideoGrid from '@/components/VideoGrid';

export const dynamic = 'force-dynamic';


export default async function VideosPage() {
  const videos = await prisma.video.findMany({ orderBy: { order: 'asc' } });
  return (
    <div className="bg-black pt-32">
      <section className="px-6 pb-4 text-center">
        <p className="text-xs uppercase tracking-widest text-gold">Films</p>
        <h1 className="mt-3 font-serif text-4xl text-white md:text-6xl">Wedding Films</h1>
      </section>
      <VideoGrid videos={videos} />
    </div>
  );
}
