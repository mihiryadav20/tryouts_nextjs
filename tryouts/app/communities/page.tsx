"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { MainNav } from '@/components/main-nav';

export default function CommunitiesPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for demo purposes
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
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
            <CardTitle>Communities</CardTitle>
            <CardDescription>Please sign in to view communities.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 md:px-12 lg:px-24 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <MainNav />
        <div>{/* Placeholder for future actions */}</div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Communities</CardTitle>
          <CardDescription>This feature is coming soon.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The communities feature is currently under development. Check back later!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
