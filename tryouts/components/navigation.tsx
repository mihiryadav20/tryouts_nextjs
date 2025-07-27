'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-foreground">
              GameHub
            </Link>
            
            {status === 'authenticated' && (
              <div className="flex space-x-4">
                <Link 
                  href="/games" 
                  className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Games
                </Link>
                <Link 
                  href="/profile" 
                  className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Profile
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : status === 'authenticated' ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-foreground">
                  Hi, {session.user?.name}
                </span>
                <Button
                  onClick={() => signOut()}
                  variant="destructive"
                  size="sm"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => signIn('google')}
                size="sm"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
