"use client";

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Bookmark, 
  Share2, 
  Printer,
  Facebook,
  Twitter,
  MessageCircle,
  Mail,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { QRCodeSVG } from 'qrcode.react';
import type { DraftResponseData } from '@/types/post-recipe/recipe';

interface ActionButtonsProps {
  recipe: DraftResponseData;
  url: string;
  author: {
    name: string;
  };
  className?: string;
}

export function ActionButtons({ recipe, url, author, className }: ActionButtonsProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  // Add print-specific styles when component mounts
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        #recipe-print-layout, #recipe-print-layout * {
          visibility: visible;
        }
        #recipe-print-layout {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        @page {
          size: auto;
          margin: 20mm 15mm;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Recipe link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err: unknown) {
      console.error('Error copying link:', err);
      toast({
        title: "Failed to copy link",
        description: "Please try again or copy the URL manually.",
        variant: "destructive",
      });
    }
  };

  const shareButtons = [
    {
      name: 'Copy Link',
      icon: copied ? Check : Copy,
      onClick: handleCopyLink,
      className: 'bg-secondary hover:bg-secondary/90'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`),
      className: 'bg-[#1877F2] hover:bg-[#1877F2]/90'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      onClick: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(recipe.title)}`),
      className: 'bg-[#1DA1F2] hover:bg-[#1DA1F2]/90'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      onClick: () => window.open(`https://wa.me/?text=${encodeURIComponent(`${recipe.title}\n${url}`)}`),
      className: 'bg-[#25D366] hover:bg-[#25D366]/90'
    },
    {
      name: 'Email',
      icon: Mail,
      onClick: () => window.open(`mailto:?subject=${encodeURIComponent(recipe.title)}&body=${encodeURIComponent(`Check out this recipe:\n${url}`)}`),
      className: 'bg-secondary hover:bg-secondary/90'
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Like & Bookmark Buttons */}
        <div className="flex gap-2">
          <Button
            variant={isLiked ? "default" : "outline"}
            size="icon"
            onClick={() => setIsLiked(!isLiked)}
            className={isLiked ? "text-white bg-red-500 hover:bg-red-600" : ""}
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
          </Button>
          <Button
            variant={isBookmarked ? "default" : "outline"}
            size="icon"
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={isBookmarked ? "text-white bg-primary" : ""}
          >
            <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
          </Button>
        </div>

        {/* Share Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share Recipe</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="flex flex-col gap-4">
                {shareButtons.map((button) => (
                  <Button
                    key={button.name}
                    variant="outline"
                    className={`w-full ${button.className} text-white justify-start text-sm`}
                    onClick={button.onClick}
                  >
                    <button.icon className="h-4 w-4 mr-2" />
                    {button.name}
                  </Button>
                ))}
              </div>

              {/* QR Code */}
              <div className="flex items-center justify-center pt-4">
                <QRCodeSVG
                  value={url}
                  size={160}
                  level="M"
                  includeMargin={true}
                  className="bg-white p-2 rounded-lg"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Print Button */}
        <Button variant="outline" size="icon" onClick={handlePrint}>
          <Printer className="h-5 w-5" />
        </Button>
      </div>

      {/* Print Layout - Hidden until print */}
      <div id="recipe-print-layout" className="hidden print:block print:p-8">
        {/* Header */}
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
          <p className="text-gray-600">{recipe.description}</p>
          <p className="text-sm mt-2">By {author.name}</p>
        </div>

        {/* Recipe Info Grid */}
        <div className="grid grid-cols-4 gap-4 my-6 text-sm">
          <div>
            <p className="font-semibold">Prep Time</p>
            <p>{recipe.prep_time} min</p>
          </div>
          <div>
            <p className="font-semibold">Cook Time</p>
            <p>{recipe.cook_time} min</p>
          </div>
          <div>
            <p className="font-semibold">Servings</p>
            <p>{recipe.servings}</p>
          </div>
          <div>
            <p className="font-semibold">Difficulty</p>
            <p className="capitalize">{recipe.difficulty_level}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-2 gap-8">
          {/* Ingredients */}
          <div>
            <h2 className="text-xl font-bold mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-baseline gap-2">
                  <span className="text-sm">□</span>
                  <span>
                    {ingredient.quantity} {ingredient.unit} {ingredient.name}
                    {ingredient.notes && (
                      <span className="text-gray-600"> ({ingredient.notes})</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h2 className="text-xl font-bold mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <span className="font-bold min-w-[24px]">{step.stepNumber}.</span>
                  <div>
                    <p>{step.instruction}</p>
                    {step.timing && (
                      <p className="text-sm text-gray-600 mt-1">
                        Time: {step.timing} minutes
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-6 mt-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p>Recipe from {url}</p>
              <p>Printed on {new Date().toLocaleDateString()}</p>
            </div>
            <QRCodeSVG value={url} size={80} level="M" includeMargin={true} />
          </div>
        </div>
      </div>
    </>
  );
}