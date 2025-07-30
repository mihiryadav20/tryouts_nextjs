'use client';

import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { MainNav } from '@/components/main-nav';
import { Loader } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  
  if (status === 'loading') {
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
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>Please sign in to access this content.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Hide navigation on create game page
  const isCreateGamePage = pathname === '/games/create';
  
  return (
    <div className="container mx-auto px-6 md:px-12 lg:px-24 py-6 space-y-6">
      {!isCreateGamePage && (
        <div className="flex justify-between items-center">
          <MainNav />
          {pathname === '/games' && (
            <Button asChild variant="default" className="text-white">
              <Link href="/games/create">Create Game</Link>
            </Button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
