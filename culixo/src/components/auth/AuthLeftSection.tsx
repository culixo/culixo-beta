// components/auth/AuthRightSection.tsx
import { ChefHat, Heart, Users } from "lucide-react";
import Image from "next/image";

export function AuthLeftSection() {
  return (
    <div className="hidden lg:flex flex-1 relative overflow-hidden">
      <Image
        src="/images/auth/slide.jpg"
        alt="Culixo App Interface Preview"
        fill
        className="object-cover"
        priority
      />
      
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 to-purple-600/80 backdrop-blur-[2px]" />

      <div className="relative z-10 w-full h-full flex items-center">
        <div className="max-w-xl px-16 space-y-8">
          <h2 className="text-4xl font-bold text-white drop-shadow-lg [text-shadow:_0_1px_2px_rgba(0,0,0,0.5)]">
            Share Your Culinary Journey
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-lg">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <p className="text-white text-lg font-medium leading-relaxed drop-shadow-md [text-shadow:_0_1px_1px_rgba(0,0,0,0.3)]">
                Join a community of passionate home chefs sharing their favorite recipes
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <p className="text-white text-lg font-medium leading-relaxed drop-shadow-md [text-shadow:_0_1px_1px_rgba(0,0,0,0.3)]">
                Build your collection of cherished recipes and cooking memories
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <p className="text-white text-lg font-medium leading-relaxed drop-shadow-md [text-shadow:_0_1px_1px_rgba(0,0,0,0.3)]">
                Connect with fellow food lovers and inspire each other&apos;s kitchen adventures
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}