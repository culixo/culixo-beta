// src/components/sections/HeroSection.tsx
import { TypewriterEffect } from "@/components/ui/TypewriterEffect";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { HeroSearch } from "./HeroSearch";

interface HeroSectionProps {
  theme: string | undefined;
}

export const HeroSection = ({ theme }: HeroSectionProps) => {
  const trendingSearches = [
    "breakfast recipes",
    "quick dinners",
    "vegetarian",
    "desserts",
    "italian cuisine",
    "healthy meals",
  ];

  return (
    <section className="relative min-h-[calc(100vh-4rem)] mt-16 pb-16 pt-16">
      <div className="relative h-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-28 flex flex-col items-center">
          <div className="max-w-4xl w-full text-center lg:pt-20">
            <motion.div
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1 }}
            >
              <TypewriterEffect
                text="Discover the world's best recipes"
                className={cn(
                  "text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6",
                  "font-medium font-serif",
                  theme === "dark" ? "text-white" : "text-zinc-800"
                )}
                style={{ letterSpacing: "-0.02em" }}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2 }}
              className={cn(
                "text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed",
                theme === "dark" ? "text-zinc-300" : "text-zinc-600"
              )}
            >
              Explore recipes from talented home chefs and culinary experts ready
              to transform your kitchen experience
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.3 }}
              className="w-full max-w-[720px] mx-auto mb-8"
            >
              <HeroSearch />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.6 }}
              className="flex flex-wrap items-center justify-center gap-2 mt-6"
            >
              <span
                className={cn(
                  "text-sm mr-2",
                  theme === "dark" ? "text-zinc-400" : "text-zinc-500"
                )}
              >
                Trending searches
              </span>
              {trendingSearches.map((search) => (
                <button
                  key={search}
                  className={cn(
                    "px-4 py-2 text-sm rounded-full transition-all",
                    theme === "dark"
                      ? "bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
                    "whitespace-nowrap"
                  )}
                >
                  {search}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};