'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function HomePage() {
  const { data: session, status } = useSession();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to GameHub
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Organize and join sports games in your area
        </p>
        
        {status === 'loading' ? (
          <div className="text-gray-500">Loading...</div>
        ) : status === 'authenticated' ? (
          <div className="space-y-4">
            <p className="text-lg text-gray-700">
              Welcome back, {session.user?.name}!
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                href="/games" 
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium"
              >
                View Games
              </Link>
              <Link 
                href="/games" 
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-medium"
              >
                Create Game
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-lg text-gray-700">
              Sign in to start organizing and joining games
            </p>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <div className="text-3xl mb-4">🏀</div>
          <h3 className="text-lg font-semibold mb-2">Create Games</h3>
          <p className="text-gray-600">
            Organize sports events and invite players to join
          </p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <div className="text-3xl mb-4">👥</div>
          <h3 className="text-lg font-semibold mb-2">Find Players</h3>
          <p className="text-gray-600">
            Connect with other players and build your sports community
          </p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <div className="text-3xl mb-4">📍</div>
          <h3 className="text-lg font-semibold mb-2">Local Events</h3>
          <p className="text-gray-600">
            Discover games happening in your area
          </p>
        </div>
      </div>
    </div>
  );
}
