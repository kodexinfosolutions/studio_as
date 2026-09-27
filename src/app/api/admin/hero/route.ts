import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAuth() {
  const session = await getServerSession(authOptions);
  return !!session;
}

export async function GET() {
  const hero = await prisma.hero.findUnique({ where: { id: 'singleton' } });
  return NextResponse.json(hero);
}

export async function PUT(req: NextRequest) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const hero = await prisma.hero.upsert({
    where: { id: 'singleton' },
    update: body,
    create: { id: 'singleton', ...body },
  });
  return NextResponse.json(hero);
}
