import { prisma } from '@/lib/db';
import type { User } from '@/app/generated/prisma';
import { hash, compare } from 'bcrypt';

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function createUser(data: {
  email: string;
  password: string;
  name?: string;
}) {
  const hashedPassword = await hash(data.password, 10);
  
  return prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
    },
  });
}

export async function validateUserPassword(
  email: string,
  password: string
): Promise<User | null> {
  const user = await getUserByEmail(email);
  
  if (!user) {
    return null;
  }
  
  // Check if password exists before comparing
  if (!user.password) {
    return null;
  }
  
  const isValid = await compare(password, user.password);
  
  if (!isValid) {
    return null;
  }
  
  return user;
}
