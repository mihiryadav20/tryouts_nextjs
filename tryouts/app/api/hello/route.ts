import { NextResponse } from 'next/server';

// Basic backend endpoint: GET /api/hello
export async function GET() {
  // Any server-side logic would go here (DB query, etc.)
  return NextResponse.json({ message: 'Hello from the backend!' });
}
