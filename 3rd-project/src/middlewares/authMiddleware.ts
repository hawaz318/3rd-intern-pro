import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';

export type AuthUser = {
  id: string;
  email: string;
  name :  string;
};

type AuthHandler = (req: NextRequest, user: AuthUser) => Promise<NextResponse>;
export function withAuth(handler: AuthHandler ) {
  return async (req: NextRequest) => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    try {
      const user = verifyToken(token) as AuthUser;
      return await handler(req, user);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  };
};
