'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader } from 'lucide-react';
import { MainNav } from '@/components/main-nav';

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
      <div className="flex items-center justify-center h-screen">
        <Loader className="h-16 w-16 animate-spin" />
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
    <div className="container mx-auto px-6 md:px-12 lg:px-24 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <MainNav />
        <Button asChild variant="default" className="text-white">
          <a href="/games/create">Create Game</a>
        </Button>
      </div>

      {/* Games list */}
      {games.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No games found</CardTitle>
            <CardDescription>There are currently no games available. Be the first to create one!</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {games.map((game) => (
            <Card key={game.id}>
              <CardHeader>
                <CardTitle>{game.eventName}</CardTitle>
                <CardDescription>{game.sportType} • {game.skillLevel}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <div className="font-semibold">{game.location}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(game.startTime).toLocaleString()} - {new Date(game.endTime).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="text-sm">{game.playersRequired} - {game.maxPlayers} players</div>
                  <div className="text-sm">₹{game.costPerPerson} per person</div>
                </div>
                <div className="mt-2 grid gap-1 text-xs text-muted-foreground">
                  <p><strong>Date:</strong> {new Date(game.startTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p><strong>Time:</strong> {new Date(game.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} - {new Date(game.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                  <p><strong>Organizer:</strong> {game.organizer.name}</p>
                </div>
                {game.description && (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-sm text-muted-foreground">{game.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
