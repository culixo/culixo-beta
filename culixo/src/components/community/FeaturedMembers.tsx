// src/components/community/FeaturedMembers.tsx
"use client"

import { motion } from "framer-motion";
import Image from "next/image";
import { Award, Heart, MessageSquare, ChefHat } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockMembers } from '@/types/community';

const containerVariants = {
  hidden: { 
    opacity: 0 
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

export default function FeaturedMembers() {
  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Featured Members</h2>
          <p className="text-muted-foreground">Meet our top contributors</p>
        </div>
        <Button variant="outline">View All Members</Button>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {mockMembers.map((member) => (
          <motion.div key={member.id} variants={itemVariants} layout>
            <Card className="hover-card-subtle group">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <Avatar className="w-16 h-16">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </Avatar>
                    {member.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {member.name}
                      </h3>
                      <Button variant="ghost" size="sm">
                        Follow
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground mt-1">
                      {member.specialty}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {member.badges.map((badge, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="group-hover:bg-primary/10 transition-colors"
                        >
                          <Award className="w-3 h-3 mr-1" />
                          {badge}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="text-center">
                        <ChefHat className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {member.recipesShared}
                        </span>
                        <p className="text-xs text-muted-foreground">Recipes</p>
                      </div>
                      <div className="text-center">
                        <Heart className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {member.likesReceived}
                        </span>
                        <p className="text-xs text-muted-foreground">Likes</p>
                      </div>
                      <div className="text-center">
                        <MessageSquare className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {member.helpfulComments}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          Comments
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}