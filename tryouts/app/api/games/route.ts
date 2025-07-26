import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { createGame, getGames } from '@/api/models/game';
import { decode } from 'next-auth/jwt';

// Helper function to get user from session token
async function getUserFromToken(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionTokenCookie = cookieHeader
      .split(';')
      .find(c => c.trim().startsWith('next-auth.session-token='));
    
    if (!sessionTokenCookie) {
      console.log('No session token found in cookies');
      return null;
    }
    
    const token = sessionTokenCookie.split('=')[1].trim();
    const decoded = await decode({
      token,
      secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here'
    });
    
    console.log('Decoded token:', JSON.stringify(decoded));
    
    if (!decoded) return null;
    
    return {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      image: decoded.picture
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

/**
 * GET /api/games - Get all games (authenticated users only)
 */
export async function GET(request: NextRequest) {
  try {
    // Get user from token
    const user = await getUserFromToken(request);
    console.log('User from token in GET /api/games:', JSON.stringify(user));
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to view games.' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip') || '0');
    const take = parseInt(searchParams.get('take') || '10');
    const sportType = searchParams.get('sportType') || undefined;
    const skillLevel = searchParams.get('skillLevel') || undefined;
    const status = searchParams.get('status') as 'live' | 'expired' | undefined;

    // Build where clause
    const where: any = {};
    if (sportType) where.sportType = sportType;
    if (skillLevel) where.skillLevel = skillLevel;
    if (status) where.status = status;

    // Get games
    const games = await getGames({
      skip,
      take,
      where,
      orderBy: { startTime: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: games,
      pagination: {
        skip,
        take,
        total: games.length
      }
    });

  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/games - Create a new game (authenticated users only)
 */
export async function POST(request: NextRequest) {
  try {
    // Get user from token
    const user = await getUserFromToken(request);
    console.log('User from token in POST /api/games:', JSON.stringify(user));
    
    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to create a game.' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      eventName,
      startTime,
      endTime,
      location,
      costPerPerson,
      description,
      playersRequired,
      maxPlayers,
      sportType,
      skillLevel,
      status
    } = body;

    // Validate required fields
    if (!eventName || !startTime || !endTime || !location || 
        costPerPerson === undefined || !playersRequired || !maxPlayers || !sportType) {
      return NextResponse.json(
        { error: 'Missing required fields. Please provide eventName, startTime, endTime, location, costPerPerson, playersRequired, maxPlayers, and sportType.' },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (start <= now) {
      return NextResponse.json(
        { error: 'Start time must be in the future.' },
        { status: 400 }
      );
    }

    if (end <= start) {
      return NextResponse.json(
        { error: 'End time must be after start time.' },
        { status: 400 }
      );
    }

    // Validate numeric fields
    if (costPerPerson < 0 || playersRequired <= 0 || maxPlayers <= 0) {
      return NextResponse.json(
        { error: 'Cost per person must be non-negative, and player counts must be positive.' },
        { status: 400 }
      );
    }

    if (playersRequired > maxPlayers) {
      return NextResponse.json(
        { error: 'Players required cannot exceed maximum players.' },
        { status: 400 }
      );
    }

    // Create game data
    const gameData = {
      eventName,
      startTime: start,
      endTime: end,
      location,
      costPerPerson: parseFloat(costPerPerson),
      description: description || null,
      playersRequired: parseInt(playersRequired),
      maxPlayers: parseInt(maxPlayers),
      sportType,
      skillLevel: skillLevel || 'Beginner',
      status: status || 'live',
      organizerId: user.id
    };

    // Create the game
    const game = await createGame(gameData);

    return NextResponse.json({
      success: true,
      message: 'Game created successfully',
      data: game
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
