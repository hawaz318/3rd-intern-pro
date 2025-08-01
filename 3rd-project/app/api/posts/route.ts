import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { PostSchema } from '@/validators/postValidator';
import { withAuth } from '@/middlewares/authMiddleware';


export const GET = withAuth(async (req: NextRequest, user: any) => {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  const posts = await prisma.post.findMany({
    where: {
      AND: [
        {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } }
          ]
        },
        category ? { category: { equals: category, mode: 'insensitive' } } : {}
      ]
    },
    include: {
      User: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(posts);
});


export const POST = withAuth(async (req: NextRequest, user: any) => {
  const body = await req.json();
  const validated = PostSchema.safeParse(body);

  if (!validated.success) {
    return NextResponse.json({ error: validated.error.flatten() }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      ...validated.data,
      userId: user.id
    }
  });

  return NextResponse.json(post, { status: 201 });
});
