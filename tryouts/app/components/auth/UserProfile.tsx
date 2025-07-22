"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function UserProfile() {
  const { data: session } = useSession();
  const [imageError, setImageError] = useState(false);

  if (!session || !session.user) {
    return null;
  }

  return (
    <Card className="max-w-md w-full">
      <CardContent className="flex flex-col items-center space-y-4 pt-6">
        <Avatar className="h-20 w-20">
          {session.user.image && !imageError ? (
            <AvatarImage 
              src={session.user.image}
              alt={session.user.name || "User"}
              onError={() => setImageError(true)}
            />
          ) : (
            <AvatarFallback className="text-2xl">
              {session.user.name?.charAt(0) || "U"}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="text-center">
          <h2 className="text-xl font-semibold">{session.user.name}</h2>
          <p className="text-muted-foreground">{session.user.email}</p>
        </div>
        <Badge variant="success">
          Authenticated
        </Badge>
      </CardContent>
    </Card>
  );
}
