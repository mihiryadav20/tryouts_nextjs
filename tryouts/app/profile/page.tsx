"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export default function ProfilePage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/")
    },
  })

  if (status === "loading") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading your profile...</p>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="bg-card rounded-lg shadow-lg p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {session?.user?.image && (
            <img 
              src={session.user.image} 
              alt={session.user.name || "Profile"} 
              className="rounded-full w-24 h-24 object-cover border-4 border-primary"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{session?.user?.name}</h1>
            <p className="text-muted-foreground">{session?.user?.email}</p>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p>{session?.user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p>{session?.user?.name}</p>
            </div>
            {/* User ID is not available in the default session object */}
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <Button 
            variant="destructive" 
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}
