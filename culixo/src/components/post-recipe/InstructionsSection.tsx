'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Clock, 
  X,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { StepComponentProps, InstructionStep } from '@/types/post-recipe/recipe';
import { useToast } from '@/components/ui/use-toast';
import { draftApi } from '@/lib/api/draft';


const InstructionsSection: React.FC<StepComponentProps> = ({
  formData,
  setFormData,
  onNext,
  onPrevious,
  isFirst,
  isLast,
}) => {
  const [currentInstruction, setCurrentInstruction] = useState<Omit<InstructionStep, 'id' | 'stepNumber'>>({
    instruction: '',
    timing: undefined,
    mediaUrls: [],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast(); 
  const [isUploading, setIsUploading] = useState(false);


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    try {
      setIsUploading(true);
      console.log('Starting upload process with file:', file.name);
      
      const imageUrl = await draftApi.uploadInstructionImage(file);
      console.log('Received image URL:', imageUrl);
  
      if (!imageUrl) {
        throw new Error('No URL received from server');
      }
  
      setCurrentInstruction(prev => ({
        ...prev,
        mediaUrls: [...prev.mediaUrls, imageUrl]
      }));
  
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: unknown) {
      console.error('Full upload error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image. Please try again.';
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const addInstruction = () => {
    if (!currentInstruction.instruction.trim()) {
      alert('Please enter instruction text');
      return;
    }

    const newInstruction: InstructionStep = {
      id: crypto.randomUUID(),
      stepNumber: formData.instructions.length + 1,
      ...currentInstruction,
    };

    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, newInstruction]
    }));

    // Reset form
    setCurrentInstruction({
      instruction: '',
      timing: undefined,
      mediaUrls: [],
    });
  };

  const removeInstruction = (id: string) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions
        .filter(inst => inst.id !== id)
        .map((inst, index) => ({
          ...inst,
          stepNumber: index + 1,
        }))
    }));
  };

  const clearAllInstructions = () => {
    setFormData(prev => ({
      ...prev,
      instructions: []
    }));
    setCurrentInstruction({
      instruction: '',
      timing: undefined,
      mediaUrls: [],
    });
  };

  const removeCurrentImage = (index: number) => {
    setCurrentInstruction(prev => ({
      ...prev,
      mediaUrls: prev.mediaUrls.filter((_, i) => i !== index)
    }));
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="w-full max-w-4xl mx-auto animate-in fade-in duration-500">
        <Card className="bg-card border-none shadow-lg dark:shadow-none">
          <CardHeader className="space-y-2 pb-6 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  Instructions
                </CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add step-by-step instructions for your recipe</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 px-4 border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive flex items-center gap-2"
                    disabled={formData.instructions.length === 0}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="font-medium">Clear All</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear all instructions?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All instructions will be
                      removed from your recipe.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={clearAllInstructions}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Clear All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <CardDescription>
              Break down your recipe into clear, easy-to-follow steps.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* Add Instruction Form */}
            <div className="space-y-4 p-4 rounded-lg border bg-card">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium">
                      {formData.instructions.length + 1}
                    </span>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <Textarea
                        value={currentInstruction.instruction}
                        onChange={(e) =>
                          setCurrentInstruction((prev) => ({
                            ...prev,
                            instruction: e.target.value,
                          }))
                        }
                        placeholder="Describe this step..."
                        className="min-h-[100px] resize-none"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      {/* Timing Input */}
                      <div className="flex items-center gap-2 min-w-[150px]">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="Time (minutes)"
                          value={currentInstruction.timing || ""}
                          onChange={(e) =>
                            setCurrentInstruction((prev) => ({
                              ...prev,
                              timing: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            }))
                          }
                          className="h-9"
                        />
                      </div>

                      {/* Image Upload */}
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="relative">
                              <Input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={isUploading}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 min-w-[120px]"
                                disabled={isUploading}
                              >
                                {isUploading && (
                                  <div className="absolute inset-0 bg-background flex items-center justify-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Uploading...</span>
                                  </div>
                                )}
                                <div
                                  className={`flex items-center justify-center gap-2 ${
                                    isUploading ? "opacity-0" : ""
                                  }`}
                                >
                                  <ImageIcon className="h-4 w-4" />
                                  <span>Add Photo</span>
                                </div>
                              </Button>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add a photo for this step</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>

                      {/* Add Step Button */}
                      <Button
                        onClick={addInstruction}
                        className="h-9 px-5 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 shadow-sm ml-auto"
                      >
                        <Plus className="h-4 w-4" />
                        <span className="font-medium">Add Step</span>
                      </Button>
                    </div>

                    {/* Preview Images */}
                    {currentInstruction.mediaUrls.length > 0 && (
                      <div className="flex gap-2 flex-wrap pt-2">
                        {currentInstruction.mediaUrls.map((url, index) => (
                          <div
                            key={index}
                            className="relative group w-24 h-24 rounded-lg overflow-hidden border"
                          >
                            <Image
                              src={url}
                              alt={`Preview ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 96px) 100vw, 96px"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeCurrentImage(index)}
                              className="absolute top-1 right-1 h-6 w-6 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Instructions List */}
            {formData.instructions.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground pl-1">
                  Added Instructions
                </h3>
                <div className="space-y-4">
                  {formData.instructions.map((instruction) => (
                    <div
                      key={instruction.id}
                      className="group rounded-lg border bg-card p-4 hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        {/* Step Number */}
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-medium">
                            {instruction.stepNumber}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-3">
                          {/* Instruction Text */}
                          <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                            {instruction.instruction}
                          </p>

                          {/* Meta Information */}
                          <div className="flex flex-wrap items-center gap-4">
                            {instruction.timing && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{instruction.timing} minutes</span>
                              </div>
                            )}
                          </div>

                          {/* Images */}
                          {instruction.mediaUrls.length > 0 && (
                            <div className="flex gap-2 flex-wrap">
                              {instruction.mediaUrls.map((url, imgIndex) => (
                                <div
                                  key={imgIndex}
                                  className="relative group/img w-24 h-24 rounded-lg overflow-hidden border"
                                >
                                  <Image
                                    src={url}
                                    alt={`Step ${
                                      instruction.stepNumber
                                    } photo ${imgIndex + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 96px) 100vw, 96px"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      const updatedUrls =
                                        instruction.mediaUrls.filter(
                                          (_, i) => i !== imgIndex
                                        );
                                      setFormData((prev) => ({
                                        ...prev,
                                        instructions: prev.instructions.map(
                                          (inst) =>
                                            inst.id === instruction.id
                                              ? {
                                                  ...inst,
                                                  mediaUrls: updatedUrls,
                                                }
                                              : inst
                                        ),
                                      }));
                                    }}
                                    className="absolute top-1 right-1 h-6 w-6 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover/img:opacity-100 transition-opacity"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  removeInstruction(instruction.id)
                                }
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive rounded-full"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Remove step</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
              <Button
                variant="outline"
                onClick={onPrevious}
                className="w-full sm:w-auto h-12 min-w-[140px]"
                disabled={isFirst}
              >
                Previous
              </Button>
              <Button
                onClick={onNext}
                className="w-full sm:w-auto h-12 min-w-[140px]"
                disabled={isLast || formData.instructions.length === 0}
              >
                Next Step
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default InstructionsSection;