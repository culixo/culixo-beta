// app/(auth)/signup/page.tsx
import { SignupForm } from "@/components/auth/SignupForm";
import { AuthLeftSection } from "@/components/auth/AuthLeftSection";

export default function SignupPage() {
    return (
      <div className="min-h-screen flex">
        {/* Auth Right Section now on the left */}
        <AuthLeftSection />
        
        {/* Signup Form now on the right */}
        <div className="flex-1 flex items-center justify-center p-4 bg-background">
          <SignupForm />
        </div>
      </div>
    );
  }