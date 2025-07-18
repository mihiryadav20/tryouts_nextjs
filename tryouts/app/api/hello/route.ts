import { getHello } from '@/server/api/hello/hello';

// Basic backend endpoint: GET /api/hello
export async function GET() {
  return getHello();
}
