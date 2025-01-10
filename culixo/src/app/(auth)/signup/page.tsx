// src/app/(auth)/signup/page.tsx
import { Suspense } from 'react';
import { SignupForm } from "@/components/auth/SignupForm";
import { AuthLeftSection } from "@/components/auth/AuthLeftSection";
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex">
      {/* Auth Right Section now on the left */}
      <AuthLeftSection />
      
      {/* Signup Form now on the right */}
      <div className="flex-1 flex items-center justify-center p-4 bg-background">
        <Suspense 
          fallback={
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}