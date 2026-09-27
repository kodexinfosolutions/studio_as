import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const sections = await prisma.homepageSection.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(sections);
}

// body: { sections: [{ id, enabled, order }] }
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { sections } = await req.json();
  await prisma.$transaction(
    sections.map((s: { id: string; enabled: boolean; order: number }) =>
      prisma.homepageSection.update({ where: { id: s.id }, data: { enabled: s.enabled, order: s.order } })
    )
  );
  return NextResponse.json({ success: true });
}
