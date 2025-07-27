"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function UserProfileLink() {
  const { data: session, status } = useSession();

  if (status === "loading" || status === "unauthenticated" || !session) return null;

  return (
    <Link
      href="/profile"
      className="text-sm font-medium text-foreground hover:underline px-4 py-2 rounded transition-colors bg-transparent hover:bg-accent"
      title="Go to profile"
    >
      {session.user?.name}
    </Link>
  );
}
