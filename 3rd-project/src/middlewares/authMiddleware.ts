import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';

type AuthUser = {
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
      const decoded = verifyToken(token);
      if (
        typeof decoded === 'object' &&
        decoded !== null &&
        'id' in decoded &&
        'email' in decoded &&
        'name' in decoded
      ) {
        const user: AuthUser = {
          id: (decoded as any).id,
          email: (decoded as any).email,
          name: (decoded as any).name,
        };
        return handler(req, user);
      } else {
        return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
      }
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  };
}
