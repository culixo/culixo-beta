// src/components/community/InteractiveElements.tsx
"use client"

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBar,
  MessageCircle,
  Clock,
  Plus,
  Users,
  Timer,
  CheckCircle2,
  Loader2,
  PieChart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  mockPolls, 
  mockRecipeRequests, 
} from '@/types/community';

const statusColors = {
  'open': 'text-green-500 bg-green-500/10',
  'in-progress': 'text-blue-500 bg-blue-500/10',
  'solved': 'text-gray-500 bg-gray-500/10'
};

const statusIcons = {
  'open': CheckCircle2,
  'in-progress': Loader2,
  'solved': CheckCircle2
};

const getTimeAgo = (timestamp: string) => {
  const now = new Date();
  const then = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default function InteractiveElements() {
  const [selectedPoll, setSelectedPoll] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, number>>({});

  const handleVote = (pollId: string) => {
    if (selectedPoll === pollId) return;
    
    setSelectedPoll(pollId);
    setVotes(prev => ({
      ...prev,
      [pollId]: prev[pollId] ? prev[pollId] + 1 : 1
    }));
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-primary" />
            Community Polls & Requests
          </span>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            New Poll
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Active Polls */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <ChartBar className="w-4 h-4" />
              Active Polls
            </h3>

            <AnimatePresence mode="wait">
              {mockPolls.map((poll) => (
                <motion.div
                  key={poll.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{poll.question}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Avatar className="w-4 h-4">
                              <Image
                                src={poll.authorImage}
                                alt={poll.author}
                                width={16}
                                height={16}
                              />
                            </Avatar>
                            {poll.author}
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="flex items-center"
                        >
                          <Users className="w-3 h-3 mr-1" />
                          {poll.totalVotes + (votes[poll.id] || 0)} votes
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        {poll.options.map((option) => {
                          const percentage = Math.round(
                            (option.votes / poll.totalVotes) * 100
                          );

                          return (
                            <motion.div
                              key={option.id}
                              className="space-y-1"
                              whileHover={{ scale: 1.01 }}
                            >
                              <div
                                className={`
                                  p-3 rounded-md border cursor-pointer
                                  transition-colors duration-200
                                  ${
                                    selectedPoll === poll.id
                                      ? "bg-muted"
                                      : "hover:bg-muted/50"
                                  }
                                `}
                                onClick={() => handleVote(poll.id)}
                              >
                                <div className="flex justify-between mb-1">
                                  <span className="font-medium">
                                    {option.text}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {percentage}%
                                  </span>
                                </div>
                                <Progress value={percentage} className="h-2" />
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Timer className="w-4 h-4 mr-1" />
                          Ends in {getTimeAgo(poll.endDate)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Recipe Requests */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Recent Requests
              </h3>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>

            <AnimatePresence>
              {mockRecipeRequests.map((request) => {
                const StatusIcon = statusIcons[request.status];

                return (
                  <motion.div
                    key={request.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="group"
                  >
                    <Card className="hover-card-subtle">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <Image
                              src={request.requestedByImage}
                              alt={request.requestedBy}
                              width={40}
                              height={40}
                            />
                          </Avatar>

                          <div className="flex-1 space-y-2">
                            <div>
                              <div className="flex items-start justify-between">
                                <h4 className="font-medium group-hover:text-primary transition-colors">
                                  {request.title}
                                </h4>
                                <Badge
                                  variant="secondary"
                                  className={statusColors[request.status]}
                                >
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {request.status.replace("-", " ")}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {request.description}
                              </p>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{request.requestedBy}</span>
                              <span>•</span>
                              <span className="flex items-center">
                                <MessageCircle className="w-3 h-3 mr-1" />
                                {request.responses} responses
                              </span>
                              <span>•</span>
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {getTimeAgo(request.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}