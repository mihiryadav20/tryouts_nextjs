"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

export default function UserProfile() {
  const { data: session } = useSession();
  const [imageError, setImageError] = useState(false);

  if (!session || !session.user) {
    return null;
  }

  return (
    <div className="max-w-md bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-20 h-20 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
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
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                {session.user.name?.charAt(0) || "U"}
              </span>
            </div>
          )}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold">{session.user.name}</h2>
          <p className="text-gray-600 dark:text-gray-300">{session.user.email}</p>
        </div>
        <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded-full">
          Authenticated
        </span>
      </div>
    </div>
  );
}
