"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getThemeColor } from "../../theme";

export default function UserProfile() {
  const { data: session } = useSession();
  const [imageError, setImageError] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if user prefers dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);

    // Listen for changes in color scheme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (!session || !session.user) {
    return null;
  }

  return (
    <div 
      className="flex flex-col items-center gap-4 p-6 border rounded-lg shadow-sm" 
      style={{
        backgroundColor: getThemeColor(isDarkMode ? 'content1.DEFAULT' : 'content1.DEFAULT', isDarkMode),
        color: getThemeColor(isDarkMode ? 'content1.foreground' : 'content1.foreground', isDarkMode),
        borderColor: getThemeColor(isDarkMode ? 'default.400' : 'default.300', isDarkMode)
      }}
    >
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
          <div 
            className="w-full h-full flex items-center justify-center rounded-full"
            style={{
              backgroundColor: getThemeColor(isDarkMode ? 'default.300' : 'default.200', isDarkMode)
            }}
          >
            <span 
              className="text-2xl font-bold"
              style={{
                color: getThemeColor(isDarkMode ? 'default.600' : 'default.700', isDarkMode)
              }}
            >
              {session.user.name?.charAt(0) || "U"}
            </span>
          </div>
        )}
      </div>
      <div className="text-center">
        <h2 
          className="text-xl font-semibold"
          style={{
            color: getThemeColor(isDarkMode ? 'foreground' : 'foreground', isDarkMode)
          }}
        >
          {session.user.name}
        </h2>
        <p 
          className="text-sm"
          style={{
            color: getThemeColor(isDarkMode ? 'default.600' : 'default.700', isDarkMode)
          }}
        >
          {session.user.email}
        </p>
      </div>
    </div>
  );
}
