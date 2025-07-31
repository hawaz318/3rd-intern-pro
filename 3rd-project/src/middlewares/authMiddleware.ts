import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';

export function withAuth(handler: Function) {
  return async (req: NextRequest) => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    try {
      const user = verifyToken(token);
      return handler(req, user);  
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  };
}
