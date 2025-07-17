import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../../lib/generated/prisma/index';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET env variable is not set');
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signJwt(user: Pick<User, 'id' | 'email'>): string {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET!, {
    expiresIn: '7d',
  });
}

export function verifyJwt<T>(token: string): T {
  return jwt.verify(token, JWT_SECRET!) as T;
}

export interface JwtPayload {
  sub: number;
  email: string;
  iat: number;
  exp: number;
}
