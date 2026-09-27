import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  eventType: z.string().optional(),
  eventDate: z.string().optional(),
  message: z.string().optional(),
});

// simple in-memory rate limit (per server instance) — swap for a durable store (Redis) in production
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const windowMs = 60_000;
  const max = 5;
  const arr = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > max;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
  }

  const { name, phone, email, eventType, eventDate, message } = parsed.data;

  const submission = await prisma.contactSubmission.create({
    data: {
      name,
      phone,
      email: email || undefined,
      eventType,
      eventDate: eventDate ? new Date(eventDate) : undefined,
      message,
    },
  });

  return NextResponse.json({ success: true, id: submission.id });
}
