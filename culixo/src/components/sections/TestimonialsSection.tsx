// src/components/sections/TestimonialsSection.tsx
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { testimonials } from '@/data';
import { motion, AnimatePresence } from "framer-motion";
import { cn } from '@/lib/utils';
import type { ThemeProps } from '@/types';

export const TestimonialsSection = ({ theme }: ThemeProps) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-28">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "text-3xl font-bold mb-12 text-center",
            theme === 'dark' ? 'text-white' : 'text-zinc-900'
          )}
        >
          What Our Community Says
        </motion.h2>
        <div className="max-w-3xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ 
                duration: 0.5,
                ease: "easeInOut"
              }}
              className={cn(
                "rounded-xl p-8",
                theme === 'dark' 
                  ? 'bg-[#0A0A0C]/40 hover:bg-[#0A0A0C]/60 border border-white/[0.08]' 
                  : 'bg-white/80 hover:bg-white/90 border border-zinc-200/50',
                "backdrop-blur-sm"
              )}
            >
              <p className={cn(
                "text-xl italic mb-8 leading-relaxed",
                theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'
              )}>
                {testimonials[activeTestimonial].text}
              </p>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn(
                    "font-semibold",
                    theme === 'dark' ? 'text-white' : 'text-zinc-900'
                  )}>
                    {testimonials[activeTestimonial].author}
                  </p>
                  <p className={cn(
                    "text-sm",
                    theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                  )}>
                    {testimonials[activeTestimonial].role}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonials[activeTestimonial].rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : theme === 'dark' ? 'text-zinc-700' : 'text-zinc-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation dots */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  activeTestimonial === index
                    ? theme === 'dark' 
                      ? 'bg-white scale-100' 
                      : 'bg-zinc-900 scale-100'
                    : theme === 'dark'
                      ? 'bg-white/20 scale-75 hover:scale-90'
                      : 'bg-zinc-300 scale-75 hover:scale-90'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};