import { NextRequest } from 'next/server';
import { loginUser } from '@/server/api/auth/login';

export async function POST(req: NextRequest) {
  return loginUser(req);
}
