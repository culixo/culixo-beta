// src/components/sections/HeroSearch.tsx
import React, { useState } from "react";
import { useTheme } from "next-themes";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export const HeroSearch = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative w-full">
      <div
        className={cn(
          "flex items-center w-full",
          "h-12 md:h-14 rounded-full transition-all duration-200",
          theme === "dark" 
            ? "bg-zinc-900/50 ring-1 ring-zinc-800" 
            : "bg-white ring-1 ring-zinc-200",
          "overflow-hidden",
          "shadow-[0_2px_4px_rgba(0,0,0,0.02)]",
          "hover:shadow-[0_4px_8px_rgba(0,0,0,0.04)]",
          "focus-within:shadow-[0_4px_16px_rgba(0,0,0,0.1)]",
          "focus-within:ring-2",
          theme === "dark" 
            ? "focus-within:ring-zinc-700" 
            : "focus-within:ring-zinc-300",
          "pr-2 md:pr-3"
        )}
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search recipes..."
          className={cn(
            "w-full h-full pl-6",
            "bg-transparent",
            "text-base",
            "focus:outline-none focus:ring-0",
            theme === "dark"
              ? "text-white placeholder:text-zinc-500"
              : "text-zinc-900 placeholder:text-zinc-400"
          )}
        />
        <button
          className={cn(
            "aspect-square h-8 md:h-10",
            "flex items-center justify-center",
            "rounded-full",
            "transition-all duration-200",
            theme === "dark"
              ? "bg-[#6B46C1] text-white hover:bg-[#553C9A]"
              : "bg-[#6B46C1] text-white hover:bg-[#553C9A]",
            "hover:scale-105"
          )}
        >
          <Search size={18} className="flex-shrink-0" />
        </button>
      </div>
    </div>
  );
};