'use client';

import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const { data: session, status } = useSession();

  // Scroll lock for landing page only
  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  return (
    <div className="h-screen flex flex-col relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #1E90FF 0%, #125699 100%)' }}>


        <div className="h-full flex items-center justify-center p-4 relative z-10">
        <div className="text-center space-y-8 max-w-2xl w-full">
          <div>
            <h1 className="text-7xl md:text-7xl font-bold text-foreground mb-4">
              Sidelines
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Organize and join sports games in your area
            </p>
          </div>
          
          {status === 'authenticated' && (
            <div className="space-y-6 pt-4">
              <p className="text-xl text-foreground">
                Welcome back, {session.user?.name}!
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/games">
                    View Games
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
                  <Link href="/games/create">
                    Create Game
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
      