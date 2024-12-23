// src/types/index.ts
import { ReactNode } from 'react';

export interface Recipe {
  id: string;
  title: string;
  chef: string;
  time: string;
  rating: number;
  image: string;
  difficulty: string;
}

export interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
  image: string;
}

export interface Testimonial {
  text: string;
  author: string;
  role: string;
  rating: number;
}

export interface Stat {
  number: string;
  label: string;
}

export interface ThemeProps {
  theme: string | undefined;
}

// Export types for arrays
export type Features = Feature[];
export type Recipes = Recipe[];
export type Stats = Stat[];
export type Testimonials = Testimonial[];