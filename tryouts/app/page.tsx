'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const { data: session, status } = useSession();

  return (
    <div className="container mx-auto p-6 space-y-12">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-foreground">
          Welcome to GameHub
        </h1>
        <p className="text-xl text-muted-foreground">
          Organize and join sports games in your area
        </p>
        
        {status === 'loading' ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : status === 'authenticated' ? (
          <div className="space-y-4">
            <p className="text-lg text-foreground">
              Welcome back, {session.user?.name}!
            </p>
            <div className="flex justify-center space-x-4">
              <Button asChild size="lg">
                <Link href="/games">
                  View Games
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/games">
                  Create Game
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-lg text-foreground">
              Sign in to start organizing and joining games
            </p>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardHeader>
            <div className="text-3xl mb-2">🏀</div>
            <CardTitle>Create Games</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Organize sports events and invite players to join
            </CardDescription>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardHeader>
            <div className="text-3xl mb-2">👥</div>
            <CardTitle>Find Players</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Connect with other players and build your sports community
            </CardDescription>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardHeader>
            <div className="text-3xl mb-2">📍</div>
            <CardTitle>Local Events</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Discover games happening in your area
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
