// src/components/post-recipe/modal/SuccessModal.tsx
import React from 'react';
import { Check, ChefHat, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipeId: string;
  recipeTitle: string;
}

const SuccessModal = ({ isOpen, onClose, recipeId, recipeTitle }: SuccessModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 animate-pulse-subtle">
              <div className="h-20 w-20 rounded-full bg-primary/10" />
            </div>
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
              <Check className="h-10 w-10 text-primary animate-scale-in" />
            </div>
          </div>

          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl mb-2 animate-fade-in-up">
              Recipe Published Successfully!
            </DialogTitle>
            <DialogDescription className="animate-fade-in-up delay-100">
              Your recipe &quot;{recipeTitle}&quot; is now live and ready to be discovered by our community of food lovers.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex w-full flex-col gap-3 animate-fade-in-up delay-200">
            <Link href={`/recipes/${recipeId}`} className="w-full">
              <Button className="w-full" size="lg">
                View Recipe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            
            <Link href="/dashboard/recipes" className="w-full">
              <Button variant="outline" className="w-full" size="lg">
                Go to My Recipes
                <ChefHat className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;