import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signJwt } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Attempt to create the user
    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
      },
    });

    const token = signJwt({ id: user.id, email: user.email });

    return NextResponse.json(
      { token, user: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (error: any) {
    // Unique constraint failed on the email field
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    console.error('[REGISTER_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
