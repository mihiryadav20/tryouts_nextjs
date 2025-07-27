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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    eventName: '',
    gameDate: '',
    startTime: '',
    endTime: '',
    location: '',
    costPerPerson: '',
    description: '',
    playersRequired: '',
    maxPlayers: '',
    sportType: '',
    skillLevel: 'Beginner'
  });

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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      // Combine date with times
      const startTime = `${formData.gameDate}T${formData.startTime}`;
      const endTime = `${formData.gameDate}T${formData.endTime}`;
      
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          startTime,
          endTime
        }),
        credentials: 'include', // send session cookies
      });

      if (response.ok) {
        // Reset form and refresh games
        setFormData({
          eventName: '',
          gameDate: '',
          startTime: '',
          endTime: '',
          location: '',
          costPerPerson: '',
          description: '',
          playersRequired: '',
          maxPlayers: '',
          sportType: '',
          skillLevel: 'Beginner'
        });
        setShowCreateForm(false);
        fetchGames();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating game:', error);
      alert('Error creating game');
    } finally {
      setCreating(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle select changes
  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      skillLevel: value
    });
  };

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
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          variant={showCreateForm ? "outline" : "default"}
        >
          {showCreateForm ? 'Cancel' : 'Create Game'}
        </Button>
      </div>

      {/* Create Game Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Game</CardTitle>
            <CardDescription>Fill in the details to organize a new game</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name *</Label>
                <Input
                  id="eventName"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sportType">Sport Type *</Label>
                <Input
                  id="sportType"
                  name="sportType"
                  value={formData.sportType}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Basketball, Football, Tennis"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gameDate">Game Date *</Label>
                <Input
                  id="gameDate"
                  name="gameDate"
                  type="date"
                  value={formData.gameDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time *</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="costPerPerson">Cost Per Person *</Label>
                <Input
                  id="costPerPerson"
                  name="costPerPerson"
                  type="number"
                  value={formData.costPerPerson}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="playersRequired">Players Required *</Label>
                <Input
                  id="playersRequired"
                  name="playersRequired"
                  type="number"
                  value={formData.playersRequired}
                  onChange={handleInputChange}
                  required
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxPlayers">Max Players *</Label>
                <Input
                  id="maxPlayers"
                  name="maxPlayers"
                  type="number"
                  value={formData.maxPlayers}
                  onChange={handleInputChange}
                  required
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skillLevel">Skill Level</Label>
                <Select value={formData.skillLevel} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Optional description of the game..."
                />
              </div>

              <div className="md:col-span-2">
                <Button type="submit" disabled={creating}>
                  {creating ? 'Creating...' : 'Create Game'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

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
