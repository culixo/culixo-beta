'use client'

import { useEffect, useRef } from 'react'
import { Card } from "@/components/ui/card"
import { ProfileHeader } from './ProfileHeader'
import { ProfileTabs } from './ProfileTabs'
import { useProfile } from '@/services/profileService'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface ProfileLayoutProps {
  children: React.ReactNode
  userId: string
}

export function ProfileLayout({
  children,
  userId,
}: ProfileLayoutProps) {
  const { fetchProfile, isLoading, error, reset } = useProfile()
  const isFirstMount = useRef(true)

  useEffect(() => {
    // Only reset on first mount
    if (isFirstMount.current) {
      reset()
      isFirstMount.current = false
    }

    const loadProfile = async () => {
      try {
        await fetchProfile(userId)
      } catch (error) {
        console.error('Error in ProfileLayout:', {
          error,
          userId,
          stack: error instanceof Error ? error.stack : undefined
        })
      }
    }

    loadProfile()
  }, [userId, fetchProfile]) // Remove reset from dependencies

  if (isLoading) {
    // Your existing loading JSX...
    return <div>Loading...</div>
  }

  if (error) {
    return (
      <div className="min-h-screen w-full animate-fade-in-up pt-16">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}. <button 
                onClick={() => fetchProfile(userId)}
                className="underline hover:no-underline"
              >
                Try again
              </button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full animate-fade-in-up pt-16">
      <div className="container max-w-7xl mx-auto px-4 py-6 space-y-8">
        <Card className="rounded-xl shadow-sm bg-white dark:bg-[#0A0B14] border-zinc-200 dark:border-[#1d1e30]">
          <div className="p-6 space-y-8">
            <ProfileHeader userId={userId} />
            <ProfileTabs userId={userId} />
            <main className="min-h-[50vh]">
              {children}
            </main>
          </div>
        </Card>
      </div>
    </div>
  )
}