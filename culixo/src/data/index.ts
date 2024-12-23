// src/data/index.ts
import { Features, Testimonials } from "@/types";
import { Search, ChefHat, Users } from "lucide-react";
import React from 'react';

export const features: Features = [
  {
    icon: React.createElement(Search, { className: "w-16 h-16 text-primary" }),
    title: "Smart Recipe Search",
    description: "Transform your available ingredients into delicious meals. Our AI suggests perfect recipes based on what's in your kitchen.",
    image: "/images/features/feature1.jpg" // Add your generated image here
  },
  {
    icon: React.createElement(ChefHat, { className: "w-16 h-16 text-primary" }),
    title: "AI-Powered Nutrition",
    description: "Get instant nutritional information for every recipe. Make informed decisions about your meals with detailed analysis.",
    image: "/images/features/feature2.jpg" // Add your generated image here
  },
  {
    icon: React.createElement(Users, { className: "w-16 h-16 text-primary" }),
    title: "Vibrant Community",
    description: "Connect with passionate home chefs. Share recipes, get feedback, and explore culinary traditions from around the world.",
    image: "/images/features/feature3.jpg" // Add your generated image here
  }
];

export const testimonials: Testimonials = [
  {
    text: "Culixo transformed my cooking journey. The AI suggestions help me use ingredients I already have, reducing food waste and saving money!",
    author: "Sarah M.",
    role: "Home Chef",
    rating: 5
  },
  {
    text: "As a busy parent, I love how quick it is to find recipes that match my pantry. The nutrition insights help me make healthier choices for my family.",
    author: "James P.",
    role: "Parent",
    rating: 5
  },
  {
    text: "The community here is amazing! I've learned so many cooking techniques from other members and improved my skills significantly.",
    author: "Maria L.",
    role: "Food Enthusiast",
    rating: 4.9
  }
];