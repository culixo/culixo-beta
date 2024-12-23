// app/(auth)/login/page.tsx
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthLeftSection } from "@/components/auth/AuthLeftSection";

export default function LoginPage() {
    return (
      <div className="min-h-screen flex">
        {/* Auth Right Section now on the left */}
        <AuthLeftSection />
        
        {/* Login Form now on the right */}
        <div className="flex-1 flex items-center justify-center p-4 bg-background">
          <LoginForm />
        </div>
      </div>
    );
  }