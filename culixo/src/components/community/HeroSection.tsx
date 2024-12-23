// src/components/community/HeroSection.tsx
"use client"

import { motion } from 'framer-motion';
import { Users, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  const stats = [
    { icon: Users, label: 'Active Members', value: '10,000+' },
    { icon: Heart, label: 'Recipes Shared', value: '50,000+' },
    { icon: MessageCircle, label: 'Daily Discussions', value: '1,000+' },
  ];

  return (
    <section className="relative h-[500px] w-full overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-[url('/api/placeholder/1920/500')] bg-cover bg-center"
        style={{ backgroundImage: "url('/api/placeholder/1920/500')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto h-full flex flex-col justify-center items-center text-white px-4">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Join the Culixo Cooking Community
        </motion.h1>

        <motion.p 
          className="text-xl md:text-2xl text-center mb-12 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Share recipes, learn from others, and be part of a growing community of food lovers
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Join Our Community
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="flex flex-col items-center group transition-all duration-300 hover:-translate-y-1"
            >
              <stat.icon className="w-8 h-8 mb-2 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-2xl font-bold stats-number">{stat.value}</span>
              <span className="text-sm opacity-80">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}