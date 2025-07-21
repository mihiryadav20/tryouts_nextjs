"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function UserProfile() {
  const { data: session } = useSession();
  const [imageError, setImageError] = useState(false);

  if (!session || !session.user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
      <div className="relative w-20 h-20 overflow-hidden rounded-full">
        {session.user.image && !imageError ? (
          <Image
            src={session.user.image}
            alt={session.user.name || "User"}
            width={80}
            height={80}
            className="object-cover rounded-full"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <span className="text-2xl font-bold text-gray-500 dark:text-gray-300">
              {session.user.name?.charAt(0) || "U"}
            </span>
          </div>
        )}
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold">{session.user.name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{session.user.email}</p>
      </div>
    </div>
  );
}
