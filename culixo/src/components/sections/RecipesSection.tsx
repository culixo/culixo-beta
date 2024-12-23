// src/components/sections/RecipesSection.tsx

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RecipeCard } from '@/components/shared/RecipeCard';
import { cn } from '@/lib/utils';

// Course types data
const courseTypes = [
  { id: 'all', label: 'All Recipes' },
  { id: 'main', label: 'Main Course' },
  { id: 'appetizer', label: 'Appetizers' },
  { id: 'dessert', label: 'Desserts' },
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'salad', label: 'Salads' }
];

// Extended mock recipes data
const extendedRecipes = [
  {
    id: "1",
    title: "Classic Homemade Pizza",
    chef: "Chef Maria",
    time: "45 min",
    rating: 4.8,
    image: "/images/recipes/pizza.jpg",
    difficulty: "Medium",
    courseType: "main"
  },
  {
    id: "2",
    title: "Thai Green Curry",
    chef: "Chef John",
    time: "35 min",
    rating: 4.9,
    image: "/images/recipes/curry.jpg",
    difficulty: "Medium",
    courseType: "main"
  },
  {
    id: "3",
    title: "Chocolate Lava Cake",
    chef: "Chef Sarah",
    time: "25 min",
    rating: 5.0,
    image: "/images/recipes/cake.jpg",
    difficulty: "Easy",
    courseType: "dessert"
  },
  {
    id: "4",
    title: "Mediterranean Quinoa Bowl",
    chef: "Chef Alex",
    time: "30 min",
    rating: 4.7,
    image: "/images/recipes/quinoa.jpg",
    difficulty: "Easy",
    courseType: "main"
  },
  {
    id: "5",
    title: "Crispy Spring Rolls",
    chef: "Chef Lee",
    time: "40 min",
    rating: 4.8,
    image: "/images/recipes/spring-rolls.jpg",
    difficulty: "Medium",
    courseType: "appetizer"
  },
  {
    id: "6",
    title: "Berry Cheesecake",
    chef: "Chef Emma",
    time: "120 min",
    rating: 4.9,
    image: "/images/recipes/cheesecake.jpg",
    difficulty: "Hard",
    courseType: "dessert"
  },
  {
    id: "7",
    title: "Avocado Toast Supreme",
    chef: "Chef Tom",
    time: "15 min",
    rating: 4.6,
    image: "/images/recipes/avocado-toast.jpg",
    difficulty: "Easy",
    courseType: "breakfast"
  },
  {
    id: "8",
    title: "Greek Salad",
    chef: "Chef Maria",
    time: "20 min",
    rating: 4.8,
    image: "/images/recipes/greek-salad.jpg",
    difficulty: "Easy",
    courseType: "salad"
  },
  {
    id: "9",
    title: "Mushroom Risotto",
    chef: "Chef Marco",
    time: "45 min",
    rating: 4.9,
    image: "/images/recipes/risotto.jpg",
    difficulty: "Medium",
    courseType: "main"
  },
  {
    id: "10",
    title: "Fresh Summer Rolls",
    chef: "Chef Lee",
    time: "30 min",
    rating: 4.7,
    image: "/images/recipes/summer-rolls.jpg",
    difficulty: "Medium",
    courseType: "appetizer"
  }
];

interface RecipesSectionProps {
  theme: string | undefined;
}

export const RecipesSection = ({ theme }: RecipesSectionProps) => {
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter recipes based on selected course
  const filteredRecipes = extendedRecipes.filter(
    recipe => selectedCourse === 'all' || recipe.courseType === selectedCourse
  );

  // Handle scroll progress
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setScrollProgress(Math.min(progress, 100));
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Handle scroll navigation
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8;
      const newScrollPosition = scrollContainerRef.current.scrollLeft + 
        (direction === 'right' ? scrollAmount : -scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2
              className={cn(
                "text-4xl md:text-5xl font-bold mb-4",
                theme === "dark" ? "text-white" : "text-zinc-900"
              )}
            >
              Culinary Inspirations
            </h2>
            <p
              className={cn(
                "text-lg md:text-xl",
                theme === "dark" ? "text-zinc-400" : "text-zinc-600"
              )}
            >
              Discover handcrafted recipes from world-class chefs, each bringing
              unique flavors to your kitchen
            </p>
          </motion.div>

          {/* Course Type Tabs */}
          <div className="mt-12 flex flex-wrap justify-center gap-2">
            {courseTypes.map((course) => (
              <button
                key={course.id}
                onClick={() => setSelectedCourse(course.id)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  selectedCourse === course.id
                    ? theme === "dark"
                      ? "bg-purple-600 text-white"
                      : "bg-purple-600 text-white"
                    : theme === "dark"
                    ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                )}
              >
                {course.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recipe Cards Container */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="overflow-x-scroll hide-scrollbar relative"
          >
            <div className="flex gap-6 min-w-max pb-2">
              {filteredRecipes.map((recipe, idx) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="w-[280px] flex-shrink-0"
                >
                  <div
                    className={cn(
                      "h-full rounded-2xl overflow-hidden transition-all duration-300",
                      theme === "dark"
                        ? "bg-zinc-800/50 hover:shadow-xl hover:shadow-purple-500/10"
                        : "bg-white hover:shadow-xl hover:shadow-purple-200/50"
                    )}
                  >
                    <RecipeCard recipe={recipe} theme={theme} />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="sticky bottom-0 left-0 w-full h-1 bg-gray-200/20 mt-4">
              <motion.div
                className="h-full bg-purple-600"
                initial={{ width: "0%" }}
                animate={{ width: `${scrollProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none">
            {/* Left Arrow */}
            <motion.button
              onClick={() => scroll("left")}
              className={cn(
                "p-3 rounded-full pointer-events-auto transform transition-all",
                "shadow-lg backdrop-blur-sm -ml-5",
                theme === "dark"
                  ? "bg-zinc-900/90 text-white hover:bg-zinc-800 hover:shadow-purple-500/20"
                  : "bg-white/90 text-zinc-900 hover:bg-white hover:shadow-purple-200/50",
                scrollProgress === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-110"
              )}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              disabled={scrollProgress === 0}
            >
              <ChevronLeft size={24} className="text-purple-500" />
            </motion.button>

            {/* Right Arrow */}
            <motion.button
              onClick={() => scroll("right")}
              className={cn(
                "p-3 rounded-full pointer-events-auto transform transition-all",
                "shadow-lg backdrop-blur-sm -mr-5",
                theme === "dark"
                  ? "bg-zinc-900/90 text-white hover:bg-zinc-800 hover:shadow-purple-500/20"
                  : "bg-white/90 text-zinc-900 hover:bg-white hover:shadow-purple-200/50",
                scrollProgress === 100
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-110"
              )}
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              disabled={scrollProgress === 100}
            >
              <ChevronRight size={24} className="text-purple-500" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Hide scrollbar styles */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default RecipesSection;