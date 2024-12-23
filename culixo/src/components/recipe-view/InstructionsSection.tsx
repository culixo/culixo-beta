"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Clock, Camera, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import type { InstructionStep } from '@/types/post-recipe/recipe';

interface InstructionsSectionProps {
  instructions: InstructionStep[];
}

export const InstructionsSection = ({ instructions }: InstructionsSectionProps) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {instructions.map((step, index) => (
        <Card
          key={index}
          className={`transition-all duration-200 hover:shadow-md ${
            expandedStep === index ? "ring-2 ring-primary" : ""
          }`}
        >
          <div className="p-6">
            {/* Step Header */}
            <div
              className="flex items-start gap-4 cursor-pointer"
              onClick={() =>
                setExpandedStep(expandedStep === index ? null : index)
              }
            >
              {/* Step Number */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">
                  {step.stepNumber}
                </span>
              </div>

              {/* Step Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-lg font-medium leading-relaxed">
                    {step.instruction}
                  </p>
                  {(step.timing || step.mediaUrls?.length > 0) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0 mt-1"
                    >
                      {expandedStep === index ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>
                  )}
                </div>

                {/* Step Timing */}
                {step.timing && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {step.timing} minutes
                  </p>
                )}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedStep === index &&
              step.mediaUrls &&
              step.mediaUrls.length > 0 && (
                <div className="mt-4 pl-14">
                  <ScrollArea className="w-full whitespace-nowrap rounded-md">
                    <div className="flex gap-4 pt-2">
                      {step.mediaUrls.map((url, imgIndex) => (
                        <Dialog key={imgIndex}>
                          <DialogTrigger asChild>
                            <div className="relative group cursor-pointer">
                              <Image
                                src={url}
                                alt={`Step ${step.stepNumber} photo ${
                                  imgIndex + 1
                                }`}
                                width={128}
                                height={128}
                                className="rounded-lg object-cover transition-transform group-hover:scale-105"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                <Camera className="h-6 w-6 text-white" />
                              </div>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <Image
                              src={url}
                              alt={`Step ${step.stepNumber} photo ${
                                imgIndex + 1
                              }`}
                              width={800}
                              height={600}
                              className="w-full rounded-lg"
                            />
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
          </div>
        </Card>
      ))}
    </div>
  );
};