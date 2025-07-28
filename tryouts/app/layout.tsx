import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import UserProfileLink from "@/components/UserProfileLink";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OAuth App",
  description: "Next.js app with Google OAuth authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <AuthProvider>
          <ThemeProvider>
            <div className="min-h-screen bg-background">
              <div className="flex justify-end items-center h-16 px-6">
                {/* User name/profile link */}
                <UserProfileLink />
              </div>
              <main className="bg-background text-foreground">
                {children}
              </main>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
