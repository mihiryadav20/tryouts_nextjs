'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Game {
  id: string;
  eventName: string;
  startTime: string;
  endTime: string;
  location: string;
  costPerPerson: number;
  description?: string;
  playersRequired: number;
  maxPlayers: number;
  sportType: string;
  skillLevel: string;
  status: string;
  organizerId: string;
  organizer: {
    name: string;
    email: string;
  };
}

export default function GamesPage() {
  const { data: session, status } = useSession();
  const [games, setGames] = useState<Game[]>([]);

  const [loading, setLoading] = useState(true);


  // Form state


  // Fetch games
  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        console.log('Games API response:', data);
        setGames(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchGames();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);







  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Games</CardTitle>
            <CardDescription>Please sign in to view and create games.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Games</h1>
        <Button asChild variant="secondary">
          <a href="/games/create">Create Game</a>
        </Button>
      </div>

      {/* Games List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Available Games</h2>
        {games.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">No games available. Create the first one!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {games.map((game) => (
              <Card key={game.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{game.eventName}</CardTitle>
                      <CardDescription>{game.sportType} • {game.skillLevel}</CardDescription>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      game.status === 'live' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {game.status}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <p><strong>Location:</strong> {game.location}</p>
                      <p><strong>Cost:</strong> ₹{game.costPerPerson}</p>
                      <p><strong>Players:</strong> {game.playersRequired} - {game.maxPlayers}</p>
                    </div>
                    <div className="space-y-2">
                      <p><strong>Date:</strong> {new Date(game.startTime).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                      <p><strong>Time:</strong> {new Date(game.startTime).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      })} - {new Date(game.endTime).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      })}</p>
                      <p><strong>Organizer:</strong> {game.organizer.name}</p>
                    </div>
                  </div>
                  
                  {game.description && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">{game.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
