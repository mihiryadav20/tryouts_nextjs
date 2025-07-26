import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getGameById, updateGame, deleteGame } from '@/api/models/game';
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
 * GET /api/games/[id] - Get a specific game by ID (authenticated users only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user from token
    const user = await getUserFromToken(request);
    console.log('User from token in GET /api/games/[id]:', JSON.stringify(user));
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to view games.' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Get the game
    const game = await getGameById(id);

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: game
    });

  } catch (error) {
    console.error('Error fetching game:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/games/[id] - Update a specific game (only organizer can update)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user from token
    const user = await getUserFromToken(request);
    console.log('User from token in PUT /api/games/[id]:', JSON.stringify(user));
    
    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to update games.' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Check if game exists and user is the organizer
    const existingGame = await getGameById(id);
    if (!existingGame) {
      return NextResponse.json(
        { error: 'Game not found.' },
        { status: 404 }
      );
    }

    if (existingGame.organizerId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden. You can only update games you created.' },
        { status: 403 }
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

    // Build update data (only include provided fields)
    const updateData: any = {};
    if (eventName !== undefined) updateData.eventName = eventName;
    if (startTime !== undefined) updateData.startTime = new Date(startTime);
    if (endTime !== undefined) updateData.endTime = new Date(endTime);
    if (location !== undefined) updateData.location = location;
    if (costPerPerson !== undefined) updateData.costPerPerson = parseFloat(costPerPerson);
    if (description !== undefined) updateData.description = description;
    if (playersRequired !== undefined) updateData.playersRequired = parseInt(playersRequired);
    if (maxPlayers !== undefined) updateData.maxPlayers = parseInt(maxPlayers);
    if (sportType !== undefined) updateData.sportType = sportType;
    if (skillLevel !== undefined) updateData.skillLevel = skillLevel;
    if (status !== undefined) updateData.status = status;

    // Validate dates if provided
    if (updateData.startTime && updateData.startTime <= new Date()) {
      return NextResponse.json(
        { error: 'Start time must be in the future.' },
        { status: 400 }
      );
    }

    if (updateData.startTime && updateData.endTime && updateData.endTime <= updateData.startTime) {
      return NextResponse.json(
        { error: 'End time must be after start time.' },
        { status: 400 }
      );
    }

    // Validate numeric fields if provided
    if (updateData.costPerPerson !== undefined && updateData.costPerPerson < 0) {
      return NextResponse.json(
        { error: 'Cost per person must be non-negative.' },
        { status: 400 }
      );
    }

    if (updateData.playersRequired !== undefined && updateData.playersRequired <= 0) {
      return NextResponse.json(
        { error: 'Players required must be positive.' },
        { status: 400 }
      );
    }

    if (updateData.maxPlayers !== undefined && updateData.maxPlayers <= 0) {
      return NextResponse.json(
        { error: 'Maximum players must be positive.' },
        { status: 400 }
      );
    }

    if (updateData.playersRequired && updateData.maxPlayers && 
        updateData.playersRequired > updateData.maxPlayers) {
      return NextResponse.json(
        { error: 'Players required cannot exceed maximum players.' },
        { status: 400 }
      );
    }

    // Update the game
    const updatedGame = await updateGame(id, updateData);

    return NextResponse.json({
      success: true,
      message: 'Game updated successfully',
      data: updatedGame
    });

  } catch (error) {
    console.error('Error updating game:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/games/[id] - Delete a specific game (only organizer can delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user from token
    const user = await getUserFromToken(request);
    console.log('User from token in DELETE /api/games/[id]:', JSON.stringify(user));
    
    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to delete games.' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Check if game exists and user is the organizer
    const existingGame = await getGameById(id);
    if (!existingGame) {
      return NextResponse.json(
        { error: 'Game not found.' },
        { status: 404 }
      );
    }

    if (existingGame.organizerId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden. You can only delete games you created.' },
        { status: 403 }
      );
    }

    // Delete the game
    await deleteGame(id);

    return NextResponse.json({
      success: true,
      message: 'Game deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting game:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
