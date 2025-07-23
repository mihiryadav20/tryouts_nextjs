"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return null;
  }

  if (session) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Welcome back!</h1>
          <div className="flex items-center gap-3">
            {session.user?.image && (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-10 h-10 rounded-full"
              />
            )}
            <div className="text-left">
              <p className="font-medium">{session.user?.name}</p>
              <p className="text-muted-foreground text-sm">{session.user?.email}</p>
            </div>
          </div>
        </div>
        <Button
          onClick={() => signOut()}
          variant="outline"
          className="w-full"
        >
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Welcome</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Sign in with your Google account to continue
        </p>
      </div>
      <div className="grid gap-4">
        <Button
          onClick={() => signIn("google", { callbackUrl: "/profile" })}
          className="w-full "
          size="lg"
        >
          <img src="/google.svg" alt="Google" className="mr-2 h-5 w-5 inline" />
          Continue with Google
        </Button>
      </div>
    </div>
  )
}
