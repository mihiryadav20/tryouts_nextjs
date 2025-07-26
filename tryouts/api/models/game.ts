import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

/**
 * Get a game by its ID
 */
export async function getGameById(id: string) {
  return prisma.game.findUnique({
    where: { id },
    include: {
      organizer: true,
    },
  });
}

/**
 * Get games with pagination and filtering options
 */
export async function getGames(options?: {
  skip?: number;
  take?: number;
  where?: any;
  orderBy?: any;
}) {
  const { skip = 0, take = 10, where = {}, orderBy = { createdAt: 'desc' } } = options || {};
  
  return prisma.game.findMany({
    skip,
    take,
    where,
    orderBy,
    include: {
      organizer: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
}

/**
 * Create a new game
 */
export async function createGame(data: {
  eventName: string;
  startTime: Date;
  endTime: Date;
  location: string;
  costPerPerson: number;
  description?: string | null;
  playersRequired: number;
  maxPlayers: number;
  sportType: string;
  skillLevel?: string;
  organizerId: string;
  status?: 'live' | 'expired';
}) {
  return prisma.game.create({
    data,
    include: {
      organizer: true,
    },
  });
}

/**
 * Update an existing game by ID
 */
export async function updateGame(
  id: string,
  data: Partial<{
    eventName: string;
    startTime: Date;
    endTime: Date;
    location: string;
    costPerPerson: number;
    description: string | null;
    playersRequired: number;
    maxPlayers: number;
    sportType: string;
    skillLevel: string;
    status: 'live' | 'expired';
    organizerId: string;
  }>
) {
  return prisma.game.update({
    where: { id },
    data,
    include: {
      organizer: true,
    },
  });
}

export async function deleteGame(id: string) {
  return prisma.game.delete({
    where: { id },
  });
}

/**
 * Get games organized by a specific user
 */
export async function getGamesByOrganizer(organizerId: string, options?: {
  skip?: number;
  take?: number;
  status?: 'live' | 'expired';
}) {
  const { skip = 0, take = 10, status } = options || {};
  
  return prisma.game.findMany({
    where: {
      organizerId,
      ...(status ? { status } : {}),
    },
    skip,
    take,
    orderBy: { startTime: 'asc' },
    include: {
      organizer: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
}

/**
 * Get upcoming live games with filtering options
 */
export async function getLiveGames(options?: {
  skip?: number;
  take?: number;
  sportType?: string;
  skillLevel?: string;
}) {
  const { skip = 0, take = 10, sportType, skillLevel } = options || {};
  const now = new Date();
  
  return prisma.game.findMany({
    where: {
      startTime: { gt: now },
      status: 'live',
      ...(sportType ? { sportType } : {}),
      ...(skillLevel ? { skillLevel } : {}),
    },
    skip,
    take,
    orderBy: { startTime: 'asc' },
    include: {
      organizer: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
}
