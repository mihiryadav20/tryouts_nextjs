'use client';

import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const { data: session, status } = useSession();

  return (
    <div className="container mx-auto p-6 space-y-12">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-foreground">
          Welcome to Sidelines
        </h1>
        <p className="text-xl text-muted-foreground">
          Organize and join sports games in your area
        </p>
        
        {status === 'authenticated' && (
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
                <Link href="/games/create">
                  Create Game
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>


    </div>
  );
}
