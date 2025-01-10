// src/app/(auth)/login/page.tsx
import { Suspense } from 'react';
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthLeftSection } from "@/components/auth/AuthLeftSection";
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Auth Right Section now on the left */}
      <AuthLeftSection />
      
      {/* Login Form now on the right */}
      <div className="flex-1 flex items-center justify-center p-4 bg-background">
        <Suspense 
          fallback={
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}