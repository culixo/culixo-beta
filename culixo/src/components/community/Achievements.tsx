// src/components/community/Achievements.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChefHat, 
  MessageSquare, 
  Users, 
  Camera, 
  Trophy,
  Medal,
  BadgeCheck,
  LucideIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockAchievements, type Achievement } from '@/types/community';

const iconMap: Record<string, LucideIcon> = {
  ChefHat,
  MessageSquare,
  Users,
  Camera
};

const levelColors: Record<Achievement['level'], string> = {
  bronze: 'text-orange-500 dark:text-orange-400',
  silver: 'text-slate-400 dark:text-slate-300',
  gold: 'text-yellow-500 dark:text-yellow-400',
  platinum: 'text-blue-400 dark:text-blue-300'
};

const getLevelIcon = (level: Achievement['level']) => {
  switch (level) {
    case 'platinum':
      return Trophy;
    case 'gold':
      return Trophy;
    case 'silver':
      return Medal;
    case 'bronze':
      return Medal;
  }
};

export default function Achievements() {
  const [selectedCategory, setSelectedCategory] = useState<Achievement['category'] | 'all'>('all');
  const [animatingProgress, setAnimatingProgress] = useState<string[]>([]);

  const filteredAchievements = mockAchievements.filter(
    achievement => selectedCategory === 'all' || achievement.category === selectedCategory
  );

  const handleMouseEnter = (id: string) => {
    setAnimatingProgress(prev => [...prev, id]);
  };

  const handleMouseLeave = (id: string) => {
    setAnimatingProgress(prev => prev.filter(item => item !== id));
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Achievements
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="all" onValueChange={(value) => setSelectedCategory(value as Achievement['category'] | 'all')}>
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="recipes">Recipes</TabsTrigger>
            <TabsTrigger value="engagement">Social</TabsTrigger>
            <TabsTrigger value="expertise">Expert</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin pr-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {filteredAchievements.map((achievement) => {
                const Icon = iconMap[achievement.icon];
                const LevelIcon = getLevelIcon(achievement.level);
                const isAnimating = animatingProgress.includes(achievement.id);

                return (
                  <motion.div
                    key={achievement.id}
                    layout
                    className="group"
                    onMouseEnter={() => handleMouseEnter(achievement.id)}
                    onMouseLeave={() => handleMouseLeave(achievement.id)}
                  >
                    <Card className={`hover-card-subtle overflow-hidden ${
                      achievement.unlocked ? 'bg-muted/50' : ''
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-lg ${
                            achievement.unlocked ? 'bg-primary/10' : 'bg-muted'
                          }`}>
                            {Icon && <Icon className="w-5 h-5 text-primary" />}
                          </div>

                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold flex items-center gap-2">
                                  {achievement.title}
                                  {achievement.unlocked && (
                                    <BadgeCheck className="w-4 h-4 text-green-500" />
                                  )}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {achievement.description}
                                </p>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={`${levelColors[achievement.level]} flex items-center gap-1`}
                              >
                                <LevelIcon className="w-3 h-3" />
                                {achievement.level}
                              </Badge>
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">
                                  {achievement.progress}/{achievement.total}
                                </span>
                              </div>
                              <Progress 
                                value={isAnimating ? (achievement.progress / achievement.total) * 100 : 0} 
                                className="h-2"
                              />
                            </div>

                            {achievement.unlocked && achievement.unlockedAt && (
                              <p className="text-xs text-muted-foreground">
                                Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}