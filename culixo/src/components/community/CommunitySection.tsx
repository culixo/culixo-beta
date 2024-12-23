// src/components/community/CommunitySection.tsx
"use client"

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Trophy, Users, Clock, ChefHat, ArrowRight, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockChallenges, type Challenge } from '@/types/community';

const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
  switch (difficulty) {
    case 'easy':
      return 'text-green-500 dark:text-green-400';
    case 'medium':
      return 'text-yellow-500 dark:text-yellow-400';
    case 'hard':
      return 'text-red-500 dark:text-red-400';
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export default function CommunitySection() {
  const [activeTab, setActiveTab] = useState<Challenge['type']>('challenge');
  const [animationKey, setAnimationKey] = useState(0);

  const filteredChallenges = mockChallenges.filter(
    challenge => challenge.type === activeTab
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value as Challenge['type']);
    setAnimationKey(prev => prev + 1);
  };

  return (
    <section className="w-full">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Community Events</span>
            <Button variant="ghost" size="sm" className="text-xs">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="challenge" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="challenge">
                <Trophy className="w-4 h-4 mr-1" />
                Challenges
              </TabsTrigger>
              <TabsTrigger value="event">
                <Calendar className="w-4 h-4 mr-1" />
                Events
              </TabsTrigger>
              <TabsTrigger value="contest">
                <Star className="w-4 h-4 mr-1" />
                Contests
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <AnimatePresence mode="wait">
            <motion.div
              key={animationKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {filteredChallenges.map((challenge) => (
                <motion.div key={challenge.id} layout className="group">
                  <Card className="hover-card-subtle overflow-hidden">
                    <div className="relative w-full h-36">
                      <Image
                        src={challenge.image}
                        alt={challenge.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-black/50 backdrop-blur-sm"
                        >
                          <Users className="w-3 h-3 mr-1" />
                          {challenge.participants}
                        </Badge>
                        {challenge.prize && (
                          <Badge
                            variant="secondary"
                            className="bg-black/50 backdrop-blur-sm"
                          >
                            <Trophy className="w-3 h-3 mr-1" />
                            {challenge.prize}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge
                          variant="outline"
                          className={getDifficultyColor(challenge.difficulty)}
                        >
                          <ChefHat className="w-3 h-3 mr-1" />
                          {challenge.difficulty.charAt(0).toUpperCase() +
                            challenge.difficulty.slice(1)}
                        </Badge>
                        <Badge
                          variant={
                            challenge.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {challenge.status}
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {challenge.title}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-4">
                        {challenge.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDate(challenge.startDate)}
                        </div>

                        <Button
                          variant={
                            challenge.isParticipating ? "outline" : "default"
                          }
                          size="sm"
                        >
                          {challenge.isParticipating
                            ? "Participating"
                            : "Join Now"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </section>
  );
}