import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { deleteFromCloudinary } from '@/lib/cloudinary';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const image = await prisma.portfolioImage.update({ where: { id: params.id }, data: body });
  return NextResponse.json(image);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const image = await prisma.portfolioImage.findUnique({ where: { id: params.id } });
  if (image?.publicId) await deleteFromCloudinary(image.publicId);
  await prisma.portfolioImage.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
