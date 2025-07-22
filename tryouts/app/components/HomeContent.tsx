'use client';

import { useSession } from "next-auth/react";
import LoginButton from "./auth/LoginButton";
import UserProfile from "./auth/UserProfile";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function HomeContent() {
  const { data: session } = useSession();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <div>
            <h1 className="text-2xl font-bold">Welcome to Next.js</h1>
            <p className="text-sm text-muted-foreground">Authentication Demo</p>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          {session ? (
            <>
              <UserProfile />
              <LoginButton />
            </>
          ) : (
            <>
              <p className="text-center text-muted-foreground">
                Sign in to see your profile!
              </p>
              <LoginButton />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
