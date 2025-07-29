'use client';

import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect authenticated users to /games
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/games');
      return;
    }
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [status, router]);

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, oklch(0.145 0 0) 0%, oklch(0.25 0 0) 100%)' }}>
        {/* No foggy orbs - only gradient remains */}
        
        {/* Moving Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" 
          style={{
            animation: 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            opacity: 0.6
          }}
        ></div>
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      <div className="h-full flex items-center justify-center p-4 relative z-10">
        <div className="text-center space-y-12 max-w-4xl w-full">
          <div className="space-y-8">
            {/* Main Title */}
            <h1 className="p-4 text-6xl md:text-[15vw] lg:text-[12vw] xl:text-[10vw] font-black text-white mb-6 leading-none">
              SIDELINES
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-4xl lg:text-5xl text-white/90 font-light">
              Organize and join sports games in your area
            </p>
          </div>
          
          {/* Removed authenticated user UI since redirect happens immediately */}
          {/* This space intentionally left blank */}
        </div>
      </div>
    </div>
  );
}