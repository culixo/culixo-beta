// components/backgrounds/CSSBackground.tsx
"use client";

import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const CSSBackground = () => {
  const { theme } = useTheme();

  return (
    <>
      {/* Main background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Base background */}
        <div className={cn(
          "absolute inset-0 transition-colors duration-300",
          theme === 'dark' 
            ? 'bg-[#030305]' 
            : 'bg-[#F3F5F8]'  // Solid color for light mode
        )} />

        {/* Enhanced grid with perspective effect - Only in dark mode */}
        {theme === 'dark' && (
          <div 
            className="absolute w-full h-[200%] opacity-40 transition-all duration-300"
            style={{
              transform: 'perspective(1000px) rotateX(60deg) translateY(-50%) translateZ(0)',
              backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 2px), linear-gradient(rgba(255,255,255,0.1) 1px, transparent 2px)',
              backgroundSize: '40px 40px',
            }}
          />
        )}

        {/* Ambient light effects - Only in dark mode */}
        {theme === 'dark' && (
          <>
            <div className="absolute -top-25 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl bg-primary/20 opacity-40" />
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl bg-blue-500/20 opacity-40" />
          </>
        )}
      </div>

      {/* Navbar gradient */}
      <div 
        className={cn(
          "fixed top-0 left-0 right-0 h-24 z-0 pointer-events-none transition-all duration-300",
          theme === 'dark' 
            ? 'bg-gradient-to-b from-background via-background/90 to-transparent'
            : 'bg-gradient-to-b from-[#F3F5F8]/95 via-[#F3F5F8]/80 to-transparent'
        )}
      />

      {/* Footer gradient */}
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 h-24 z-0 pointer-events-none transition-all duration-300",
          theme === 'dark' 
            ? 'bg-gradient-to-t from-background to-transparent'
            : 'bg-gradient-to-t from-[#F3F5F8]/90 to-transparent'
        )}
      />
    </>
  );
};

export default CSSBackground;