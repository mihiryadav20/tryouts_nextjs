import { NextRequest } from 'next/server';
import { registerUser } from '@/server/api/auth/register';

export async function POST(req: NextRequest) {
  return registerUser(req);
}
