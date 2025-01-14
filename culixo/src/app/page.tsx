// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { RecipesSection } from "@/components/sections/RecipesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CTASection } from "@/components/sections/CTASection";
import { Footer } from "@/components/layout/Footer";

const HomePage = () => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col">
        <HeroSection theme={theme} />
        <FeaturesSection theme={theme} />
        <HowItWorksSection theme={theme} />
        <RecipesSection theme={theme} />
        <TestimonialsSection theme={theme} />
        <CTASection theme={theme} />
        <Footer theme={theme} />
      </div>
    </>
  );
};

export default HomePage;