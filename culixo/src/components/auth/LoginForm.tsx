// src/components/auth/LoginForm.tsx
"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
}

interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon: React.ReactNode;
}

const SocialButton = ({ icon, children, ...props }: SocialButtonProps) => {
  return (
    <Button 
      variant="outline"
      className={cn(
        "relative w-full h-11",
        "hover:bg-muted/50 hover:text-foreground",
        "transition-colors duration-200"
      )}
      {...props}
    >
      <span className="absolute left-3 h-5 w-5">{icon}</span>
      <span>{children}</span>
    </Button>
  );
};

export function LoginForm() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const { handleAuthSuccess } = useAuthRedirect();

  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const { user, token } = await authApi.login({
        email: formData.email,
        password: formData.password,
      });
  
      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("token", token);
      }
  
      setAuth(user, token);

      // Handle pending interactions if any
      const action = searchParams.get('action');
      const recipeId = searchParams.get('recipeId');
      const returnTo = searchParams.get('returnTo');
  
      if (action && recipeId) {
        await handleAuthSuccess({
          type: action,
          recipeId,
          returnTo: returnTo || '/explore-recipes'
        });
      } else {
        const from = searchParams.get("from");
        router.push(from || "/");
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error('Login error:', error);
      setError(apiError?.response?.data?.error || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] space-y-2">
      {/* Logo Section */}
      <Link href="/" className="flex items-center justify-center gap-3 group">
        <Image
          src="/images/culixo-logo.png"
          alt="Culixo Icon"
          width={190}
          height={190}
          className="transition-transform duration-200 group-hover:scale-105"
        />
      </Link>

      {/* Main Form */}
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Log in to your Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Select method to log in:
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <SocialButton
              icon={
                <svg viewBox="0 0 24 24" className="h-5 w-5">
                  <path
                    fill="#EA4335"
                    d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
                  />
                  <path
                    fill="#34A853"
                    d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
                  />
                  <path
                    fill="#4A90E2"
                    d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5818182 23.1272727,9.90909091 L12,9.90909091 L12,14.7272727 L18.4363636,14.7272727 C18.1187732,16.6081864 17.2662994,18.2134712 16.0407269,19.0125889 L19.834192,20.9995801 Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
                  />
                </svg>
              }
            >
              Google
            </SocialButton>

            <SocialButton
              icon={
                <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                </svg>
              }
            >
              Facebook
            </SocialButton>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or continue with email
              </span>
            </div>
          </div>

          {/* Email and Password Fields */}
          <div className="space-y-4">
            <div>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                className="h-11"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="h-11 pr-10"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-11 w-11 px-0 hover:bg-transparent"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Log in"}
            </Button>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Create an account
          </Link>
        </div>

        {/* Terms and Privacy */}
        <p className="text-xs text-center text-muted-foreground">
          By logging in, you agree to our{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}