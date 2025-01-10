// src/app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme"
import { Providers } from "@/components/providers/providers"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/layout/navbar"
import CSSBackground from "@/components/backgrounds/CSSBackground"
import { AuthSuccessHandler } from '@/components/auth/AuthSuccessHandler'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Culixo",
  description: "Community Recipe Platform",
  icons: {
    icon: [
      {
        rel: 'icon',
        url: '/favicon.png',
        type: 'image/png',
      },
      {
        rel: 'shortcut icon',
        url: '/favicon.png',
        type: 'image/png',
      }
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
    other: [
      {
        rel: 'apple-touch-icon',
        url: '/favicon.png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
        >
          <Providers>
            <div className="relative min-h-screen flex flex-col">
              <CSSBackground />
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <AuthSuccessHandler />
              <Toaster />
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}