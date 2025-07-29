"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function UserProfileLink() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (status === "unauthenticated" || !session) {
    return (
      <Button 
        onClick={() => signIn('google', { callbackUrl: "/games" })} 
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-auto">
            <Avatar className="h-8 w-8">
              <AvatarImage src={session.user?.image ?? ""} alt={session.user?.name ?? ""} />
              <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
            </Avatar>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Your Profile</DialogTitle>
          <DialogDescription>
            This is your user profile information.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={session.user?.image ?? ""} alt={session.user?.name ?? ""} />
              <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
                <div className="text-lg font-semibold">{session.user?.name}</div>
                <div className="text-sm text-muted-foreground">{session.user?.email}</div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={() => signOut({ callbackUrl: "/" })}>
            Sign Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
