import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export async function GET() {
  const categories = await prisma.portfolioCategory.findMany({
    orderBy: { order: 'asc' },
    include: { images: { orderBy: { order: 'asc' } } },
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { name } = await req.json();
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

  const baseSlug = slugify(name);
  let slug = baseSlug;
  let i = 1;
  while (await prisma.portfolioCategory.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i++}`;
  }
  const count = await prisma.portfolioCategory.count();
  const category = await prisma.portfolioCategory.create({ data: { name, slug, order: count } });
  return NextResponse.json(category);
}
