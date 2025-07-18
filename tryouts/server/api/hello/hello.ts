import { NextResponse } from 'next/server';

export function getHello() {
  // Any server-side logic would go here (DB query, etc.)
  return NextResponse.json({ message: 'Hello from the backend!' });
}
