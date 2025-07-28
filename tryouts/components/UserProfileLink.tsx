"use client";

import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { Button } from "./ui/button";

export default function UserProfileLink() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (status === "unauthenticated" || !session) {
    return (
      <Button 
        onClick={() => signIn('google')} 
        variant="outline"
        className="ml-auto gap-2"
      >
        <img 
          src="/google.svg" 
          alt="Google" 
          className="w-4 h-4" 
        />
        Sign in with Google               
      </Button>
    );
  }

  return (
    <Link
      href="/profile"
      className="text-sm font-medium text-foreground hover:underline px-4 py-2 rounded transition-colors bg-transparent hover:bg-accent ml-auto"
      title="Go to profile"
    >
      {session.user?.name}
    </Link>
  );
}
