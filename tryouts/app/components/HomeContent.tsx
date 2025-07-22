'use client';

import { useSession } from "next-auth/react";
import LoginButton from "./auth/LoginButton";
import UserProfile from "./auth/UserProfile";

export default function HomeContent() {
  const { data: session } = useSession();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-4 border-b pb-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Welcome to Next.js</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Authentication Demo</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-6 py-6">
          {session ? (
            <>
              <UserProfile />
              <LoginButton />
            </>
          ) : (
            <>
              <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
                Sign in to see your profile!
              </p>
              <LoginButton />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
