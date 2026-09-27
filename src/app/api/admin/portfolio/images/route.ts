import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json(); // { url, publicId, categoryId, title?, altText? }
  if (!body.url || !body.categoryId) {
    return NextResponse.json({ error: 'url and categoryId required' }, { status: 400 });
  }
  const count = await prisma.portfolioImage.count({ where: { categoryId: body.categoryId } });
  const image = await prisma.portfolioImage.create({
    data: {
      url: body.url,
      publicId: body.publicId,
      categoryId: body.categoryId,
      title: body.title,
      altText: body.altText,
      order: count,
    },
  });
  return NextResponse.json(image);
}

// bulk reorder: { images: [{id, order}] }
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { images } = await req.json();
  await prisma.$transaction(
    images.map((img: { id: string; order: number }) =>
      prisma.portfolioImage.update({ where: { id: img.id }, data: { order: img.order } })
    )
  );
  return NextResponse.json({ success: true });
}
