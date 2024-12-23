"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Facebook } from "lucide-react";
import { cn } from "@/lib/utils";

interface OAuthButtonsProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
}

interface SocialProvider {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export function OAuthButtons({ 
  className, 
  isLoading, 
  ...props 
}: OAuthButtonsProps) {
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = React.useState(false);

  const providers: SocialProvider[] = [
    {
      id: "google",
      name: "Google",
      icon: (
        <svg
          className="mr-2 h-4 w-4"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="google"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
        >
          <path
            fill="currentColor"
            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
          />
        </svg>
      ),
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: <Facebook className="mr-2 h-4 w-4" />,
    },
  ];

  const handleOAuthSignIn = async (providerId: string) => {
    try {
      if (providerId === "google") {
        setIsGoogleLoading(true);
      } else if (providerId === "facebook") {
        setIsFacebookLoading(false);
      }

      // Add your OAuth sign-in logic here
      // Example:
      // await signIn(providerId, {
      //   callbackUrl: "/",
      // });

      // For demonstration, adding a delay
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`${providerId} sign-in error:`, error);
    } finally {
      setIsGoogleLoading(false);
      setIsFacebookLoading(false);
    }
  };

  return (
    <div className={cn("grid gap-4", className)} {...props}>
      {providers.map((provider) => (
        <Button
          key={provider.id}
          variant="outline"
          type="button"
          disabled={
            isLoading ||
            (provider.id === "google" && isGoogleLoading) ||
            (provider.id === "facebook" && isFacebookLoading)
          }
          onClick={() => handleOAuthSignIn(provider.id)}
          className="w-full"
        >
          {provider.icon}
          {provider.id === "google" && isGoogleLoading && (
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          Continue with {provider.name}
        </Button>
      ))}
    </div>
  );
}