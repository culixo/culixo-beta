// src/components/sections/CTASection.tsx
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  theme: string | undefined;
}

export const CTASection = ({ theme }: CTASectionProps) => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-28">
        <div className={cn(
          "rounded-xl p-8 sm:p-12 text-center",
          theme === 'dark' 
            ? 'bg-[#0A0A0C]/40 border border-white/[0.08]' 
            : 'bg-gradient-to-br from-white/80 to-white/60 border border-zinc-200 shadow-lg',
          "backdrop-blur-sm"
        )}>
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold mb-4",
            theme === 'dark' ? 'text-white' : 'text-zinc-900'
          )}>
            Ready to Start Your Culinary Journey?
          </h2>
          <p className={cn(
            "text-lg mb-8 max-w-2xl mx-auto",
            theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
          )}>
            Join thousands of food enthusiasts already sharing their passion for cooking
          </p>
          <div className="flex justify-center">
            <Button 
              size="lg"
              className="text-base flex items-center justify-center h-14 px-8 rounded-full"
            >
              Browse Popular Recipes
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};