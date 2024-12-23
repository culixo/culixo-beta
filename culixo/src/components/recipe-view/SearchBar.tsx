"use client";

import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

const SearchBar = ({ className, placeholder = "Search recipes...", onSearch }: SearchBarProps) => {
  return (
    <div className={cn("w-full max-w-3xl mx-auto", className)}>
      <div className="relative flex items-center">
        <input
          type="search"
          placeholder={placeholder}
          className="w-full h-12 pl-6 pr-14 rounded-full bg-white/95
            border border-gray-200/80
            shadow-[0_2px_10px] shadow-black/5
            focus:outline-none focus:border-purple-100 focus:ring-4 focus:ring-purple-500/10
            placeholder:text-gray-400 text-gray-600 text-[15px]"
        />
        <button 
          className="absolute right-1 p-2 rounded-full bg-purple-600 hover:bg-purple-700 
            transition-colors duration-200 h-10 w-10 flex items-center justify-center
            hover:shadow-lg hover:shadow-purple-500/20"
          onClick={() => onSearch?.('')}
        >
          <Search className="h-5 w-5 text-white" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;