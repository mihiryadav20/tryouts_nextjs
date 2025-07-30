"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
