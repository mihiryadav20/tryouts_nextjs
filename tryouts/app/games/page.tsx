'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

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
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include', // send session cookies
      });

      if (response.ok) {
        // Reset form and refresh games
        setFormData({
          eventName: '',
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (status === 'loading' || loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Games</h1>
        <p>Please sign in to view and create games.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Games</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showCreateForm ? 'Cancel' : 'Create Game'}
        </button>
      </div>

      {/* Create Game Form */}
      {showCreateForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6 text-black">
          <h2 className="text-xl font-semibold mb-4">Create New Game</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Event Name *</label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sport Type *</label>
              <input
                type="text"
                name="sportType"
                value={formData.sportType}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
                placeholder="e.g., Basketball, Football, Tennis"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Start Time *</label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">End Time *</label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cost Per Person *</label>
              <input
                type="number"
                name="costPerPerson"
                value={formData.costPerPerson}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Players Required *</label>
              <input
                type="number"
                name="playersRequired"
                value={formData.playersRequired}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Max Players *</label>
              <input
                type="number"
                name="maxPlayers"
                value={formData.maxPlayers}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Skill Level</label>
              <select
                name="skillLevel"
                value={formData.skillLevel}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border rounded"
                placeholder="Optional description of the game..."
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={creating}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create Game'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Games List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Available Games</h2>
        {games.length === 0 ? (
          <p className="text-gray-500">No games available. Create the first one!</p>
        ) : (
          <div className="grid gap-4">
            {games.map((game) => (
              <div key={game.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{game.eventName}</h3>
                  <span className={`px-2 py-1 rounded text-sm ${
                    game.status === 'live' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {game.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                  <p><strong>Sport:</strong> {game.sportType}</p>
                  <p><strong>Skill Level:</strong> {game.skillLevel}</p>
                  <p><strong>Location:</strong> {game.location}</p>
                  <p><strong>Cost:</strong> ${game.costPerPerson}</p>
                  <p><strong>Players:</strong> {game.playersRequired} - {game.maxPlayers}</p>
                  <p><strong>Organizer:</strong> {game.organizer.name}</p>
                </div>
                
                <div className="mt-2 text-sm text-gray-600">
                  <p><strong>Start:</strong> {new Date(game.startTime).toLocaleString()}</p>
                  <p><strong>End:</strong> {new Date(game.endTime).toLocaleString()}</p>
                </div>
                
                {game.description && (
                  <p className="mt-2 text-sm text-gray-700">{game.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
