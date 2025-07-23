import { prisma } from '@/lib/db';

export async function getAllPosts(includeUnpublished = false) {
  return prisma.post.findMany({
    where: includeUnpublished ? {} : { published: true },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getPostById(id: string) {
  return prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function getPostsByAuthor(authorId: string) {
  return prisma.post.findMany({
    where: { authorId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function createPost(data: {
  title: string;
  content?: string;
  published?: boolean;
  authorId: string;
}) {
  return prisma.post.create({
    data,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function updatePost(
  id: string,
  data: {
    title?: string;
    content?: string;
    published?: boolean;
  }
) {
  return prisma.post.update({
    where: { id },
    data,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function deletePost(id: string) {
  return prisma.post.delete({
    where: { id },
  });
}
